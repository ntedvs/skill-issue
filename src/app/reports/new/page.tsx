import { resumesTable } from "@/drizzle/schema"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { desc, eq } from "drizzle-orm"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import AnalysisForm from "./analysis-form"

export const metadata: Metadata = { title: "New Job Analysis" }

export default async function NewReport() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's resumes for dropdown
  const resumes = await db.query.resumesTable.findMany({
    where: eq(resumesTable.userId, session.user.id),
    orderBy: desc(resumesTable.uploadedAt),
  })

  if (resumes.length === 0) {
    redirect("/profile")
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 mt-8 text-center text-6xl">analyze</h1>

      <p className="mb-6 text-center text-foreground/40">
        paste a job posting url to analyze how well your resume matches the requirements.
      </p>

      <AnalysisForm resumes={resumes} />
    </div>
  )
}