"use server"

import { reportsTable, resumesTable } from "@/drizzle/schema"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { openai } from "@/lib/openai"
import { cleanup, description } from "@/utils/server"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { zodTextFormat } from "openai/helpers/zod"
import { z } from "zod"

const Analysis = z.object({
  jobTitle: z
    .string()
    .describe(
      "The job title only, not including company name (e.g., 'Software Engineer' not 'Software Engineer at Google')",
    ),
  companyName: z
    .string()
    .describe("The company name extracted from the posting"),
  resumeScreeningChance: z
    .string()
    .describe(
      "Percentage chance this resume passes technical screening (e.g., '73%'). Focus on technical competencies only.",
    ),
  strengthFactors: z
    .string()
    .describe(
      "8 specific skills/experiences helping screening chances as comma-separated list (e.g., 'React development experience, CS degree from top university, Previous startup experience, Strong GitHub portfolio')",
    ),
  weaknessFactors: z
    .string()
    .describe(
      "8 missing skills/experiences hurting screening chances as comma-separated list (e.g., 'No Python experience, Lacks cloud infrastructure knowledge, Missing industry experience, No backend development')",
    ),
  improvementRoadmap: z
    .string()
    .describe(
      "8 roadmap steps for improving candidacy as comma-separated list (e.g., 'Complete AWS certification, Build portfolio with Python projects, Gain microservices experience, Practice system design interviews')",
    ),
})

export const analyzeJob = async (state: unknown, fd: FormData) => {
  const session = await auth()
  if (!session) redirect("/login")

  const {
    jobUrl: url,
    resumeId: id,
    manualJobContent: manual,
  } = Object.fromEntries(fd) as { [k: string]: string }

  if ((!url && !manual) || !id) {
    return { error: "Please fill in all fields", fd }
  }

  const resume = await db.query.resumesTable.findFirst({
    where: eq(resumesTable.id, id),
  })

  if (!resume) return { error: "Resume not found", fd }

  const trim = manual && manual.trim()
  let content: string

  if (trim) content = trim
  else {
    try {
      const out = await fetch("https://api.zyte.com/v1/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(process.env.ZYTE + ":")}`,
        },
        body: JSON.stringify({ url, jobPosting: true }),
      }).then((res) => res.json())

      if (!out || out.error || out.status === 421) {
        return { scrapingFailed: true, fd }
      }

      content = JSON.stringify({
        jobTitle: out.jobPosting.jobTitle,
        company: out.jobPosting.hiringOrganization.name,
        description: description(out.jobPosting.description),
      })
    } catch {
      return { scrapingFailed: true, fd }
    }
  }

  console.log("Content")

  const response = await openai.responses.parse({
    model: "gpt-5",
    input: [
      {
        role: "system",
        content:
          "Technical skills assessor for student career development. IGNORE: location, schedule, salary, work arrangements. FOCUS: technical skills, experience, education, certifications, programming languages, tools/frameworks. Provide 8 specific items per category as comma-separated values, no grouping.",
      },
      {
        role: "user",
        content: `
          Analyze technical compatibility between resume and job requirements.

          JOB POSTING:
          ${cleanup(content)}

          RESUME:
          ${cleanup(resume.extractedText)}

          Calculate percentage chance of passing technical screening based on skills alignment, experience, education, certifications, and technology proficiency. Provide exactly 8 comma-separated items per category.

          IMPORTANT: Do not use commas, semicolons, parentheses, or lists within individual items. Each item must be a single simple phrase only.
        `,
      },
    ],
    text: { format: zodTextFormat(Analysis, "analysis") },
  })

  console.log("Analyze")

  const analysis = response.output_parsed
  if (!analysis) return { error: "Failed to analyze job posting", fd }

  const [report] = await db
    .insert(reportsTable)
    .values({
      userId: session.user.id,
      resumeId: id,
      jobUrl: url || "",
      jobContent: content,
      scrapingSucceeded: !trim,
      jobTitle: analysis.jobTitle,
      companyName: analysis.companyName,
      resumeScreeningChance: analysis.resumeScreeningChance,
      strengthFactors: analysis.strengthFactors,
      weaknessFactors: analysis.weaknessFactors,
      improvementRoadmap: analysis.improvementRoadmap,
    })
    .returning()

  redirect(`/reports/${report.id}`)
}
