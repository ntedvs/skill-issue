"use server"

import { reportsTable, resumesTable } from "@/drizzle/schema"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { openai } from "@/lib/openai"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { zodTextFormat } from "openai/helpers/zod"
import { z } from "zod"

const Analysis = z.object({
  jobTitle: z.string().describe("The job title extracted from the posting"),
  companyName: z
    .string()
    .describe("The company name extracted from the posting"),
  resumeScreeningChance: z
    .string()
    .describe(
      "Percentage chance this resume passes technical skills screening (e.g., '73%'). Focus ONLY on technical competencies: relevant experience, skill matches, education fit, technology proficiency, certifications. IGNORE: location, schedule, salary, work arrangements.",
    ),
  strengthFactors: z
    .string()
    .describe(
      "8 specific skills/experiences helping screening chances as comma-separated list. Be granular and specific (e.g., 'React development experience, CS degree from top university, Previous startup experience, Strong GitHub portfolio, Full-stack development skills, Agile methodology experience, Leadership in previous roles, Relevant internship experience')",
    ),
  weaknessFactors: z
    .string()
    .describe(
      "8 missing skills/experiences hurting screening chances as comma-separated list. Be specific about gaps (e.g., 'No Python experience, Lacks cloud infrastructure knowledge, Missing industry experience, No backend development, Limited data analysis skills, Absence of leadership roles, No relevant certifications, Insufficient project portfolio')",
    ),
  improvementRoadmap: z
    .string()
    .describe(
      "8 detailed roadmap steps for improving candidacy as comma-separated list. Include skills to learn, gaps to fill, and specific preparation steps (e.g., 'Complete AWS certification, Build portfolio with Python projects, Gain experience with microservices architecture, Practice system design interviews, Contribute to open source projects, Take online course in data structures, Build full-stack application, Network with industry professionals')",
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

  if (!url || !id) return { error: "Please fill in all fields", fd }

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

      content = JSON.stringify(out)
    } catch {
      return { scrapingFailed: true, fd }
    }
  }

  const response = await openai.responses.parse({
    model: "gpt-5",
    input: [
      {
        role: "system",
        content:
          "You are a technical skills assessor evaluating resume-to-job compatibility based SOLELY on technical competencies and qualifications. You are NOT making hiring decisions - only assessing technical skills fit for student career development. COMPLETELY IGNORE: geographic location, schedule preferences, shift requirements, salary expectations, remote/in-person work arrangements, commute distance, visa status, availability for travel, office culture fit. FOCUS EXCLUSIVELY ON: technical skills alignment, relevant work experience, educational background, certifications, industry experience, programming languages, tools/frameworks, project portfolio, career progression in relevant technical areas. Assess if someone has the technical competencies for the role, regardless of logistical factors. Be realistic about technical skills gaps. IMPORTANT: Provide detailed, granular analysis with 8 specific items for each category. Return all lists as comma-separated values, NOT bullet points. Do not group items together or use parentheses.",
      },
      {
        role: "user",
        content: `Analyze this resume's TECHNICAL COMPATIBILITY with the job requirements. Focus ONLY on skills, experience, and qualifications - completely ignore location, schedule, salary, or work arrangement factors.

          JOB POSTING:
          ${content}

          USER'S RESUME:
          ${resume.extractedText}

          Calculate the percentage chance this resume passes initial technical skills screening based exclusively on:
          - Technical skills alignment with job requirements
          - Relevant work experience and project portfolio
          - Educational background and certifications
          - Industry/domain knowledge and tools proficiency
          - Programming languages, frameworks, and technology stack

          DO NOT CONSIDER: location requirements, schedule preferences, salary expectations, work arrangements, commute, visa status, or any logistical factors. This is purely a technical competency assessment for skills gap analysis.

          For all skill/experience lists, provide exactly 8 items each as comma-separated values. Be specific and granular - list individual skills, experiences, or qualifications separately rather than grouping them. Do not use parentheses or group multiple things into single items.`,
      },
    ],
    text: { format: zodTextFormat(Analysis, "analysis") },
  })

  const analysis = response.output_parsed
  if (!analysis) return { error: "Failed to analyze job posting", fd }

  const [report] = await db
    .insert(reportsTable)
    .values({
      userId: session.user.id,
      resumeId: id,
      jobUrl: url,
      jobContent: content,
      scrapingSucceeded: !!trim,
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
