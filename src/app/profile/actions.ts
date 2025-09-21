"use server"

import { resumesTable } from "@/drizzle/schema"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { openai } from "@/lib/openai"
import { pdf } from "@/utils/server"
import { redirect } from "next/navigation"

export const uploadResume = async (formData: FormData) => {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const file = formData.get("resume") as File

  if (!file) {
    console.log("No file uploaded")
    return
  }

  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF
    const extractedText = await pdf(buffer)
    console.log("Extracted text:", extractedText.substring(0, 200) + "...")

    // Use OpenAI to extract skills
    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `Extract all the skills from this resume text. Include both hard skills (technical skills, programming languages, tools, etc.) and soft skills (communication, leadership, etc.). Return them as a comma-separated list. Resume text: ${extractedText}`,
    })

    const skills = response.output_text
    console.log("Extracted skills:", skills)

    await db.insert(resumesTable).values({
      userId: session.user.id,
      filename: file.name,
      extractedText,
      skills,
    })

    console.log("Resume saved successfully")
  } catch (error) {
    console.error("Error processing resume:", error)
  }
}
