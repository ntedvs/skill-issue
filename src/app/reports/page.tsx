import { reportsTable } from "@/drizzle/schema"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { desc, eq } from "drizzle-orm"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import DeleteButton from "./delete-button"

export const metadata: Metadata = { title: "your reports" }

export default async function Reports() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's reports
  const reports = await db.query.reportsTable.findMany({
    where: eq(reportsTable.userId, session.user.id),
    orderBy: desc(reportsTable.createdAt),
  })

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 mt-8 text-center text-6xl">reports</h1>

      <p className="text-foreground/40 mb-6 text-center">
        {reports.length > 0
          ? `you have analyzed ${reports.length} job${reports.length === 1 ? "" : "s"} - track your progress and identify skill gaps`
          : "track your job application progress with ai-powered analysis"}
      </p>

      <div className="mb-8 text-center">
        <Link
          href="/reports/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + analyze new job
        </Link>
      </div>

      {/* Reports Grid */}
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div key={report.id} className="relative">
              <Link
                href={`/reports/${report.id}`}
                className="bg-mixed border-foreground/20 flex flex-col rounded border p-6 hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-3">
                  <h3 className="mb-1 line-clamp-2 text-lg font-semibold">
                    {report.jobTitle}
                  </h3>
                  <p className="text-foreground/60 line-clamp-1 text-sm">
                    {report.companyName}
                  </p>
                </div>

                <div className="mb-3">
                  <span className="text-sm font-medium">
                    screening chance:{" "}
                  </span>
                  <span className="rounded bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-800">
                    {report.resumeScreeningChance}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-foreground/60 text-sm">
                    <span className="font-medium">key weaknesses:</span>
                  </p>
                  <p className="text-foreground/50 line-clamp-2 text-xs">
                    {report.weaknessFactors || "none"}
                  </p>
                </div>

                <div className="text-foreground/40 mt-auto text-xs">
                  {new Date(report.createdAt)
                    .toLocaleString("en-US")
                    .replace(/\//g, "-")
                    .replace(/,/g, "")}
                </div>
              </Link>
              <DeleteButton reportId={report.id} jobTitle={report.jobTitle} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="border-foreground/30 rounded border-2 border-dashed p-12 text-center">
          <h3 className="text-foreground mb-2 text-lg font-medium">
            no reports yet
          </h3>
          <p className="text-foreground/60 mb-4">
            get started by analyzing your first job posting to see how well your
            skills match!
          </p>
          <Link
            href="/reports/new"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + analyze your first job
          </Link>
        </div>
      )}
    </div>
  )
}
