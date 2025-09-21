"use server"

import { reportsTable } from "@/drizzle/schema"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export const deleteReport = async (formData: FormData) => {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const reportId = formData.get("reportId") as string

  if (!reportId) {
    console.log("No report ID provided")
    return
  }

  try {
    await db.delete(reportsTable).where(
      and(
        eq(reportsTable.id, reportId),
        eq(reportsTable.userId, session.user.id),
      ),
    )

    console.log("Report deleted successfully")
  } catch (error) {
    console.error("Error deleting report:", error)
  }

  redirect("/reports")
}