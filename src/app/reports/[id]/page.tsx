import { reportsTable, resumesTable } from "@/drizzle/schema"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { and, eq } from "drizzle-orm"
import { ArrowLeft, TrendingUp, TrendingDown, Lightbulb } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

// Helper function to convert comma-separated text to list items
function formatCommaSeparatedList(text: string): string[] {
  return text
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

interface ReportPageProps {
  params: Promise<{ id: string }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  const report = await db.query.reportsTable.findFirst({
    where: and(
      eq(reportsTable.id, id),
      eq(reportsTable.userId, session.user.id),
    ),
  })

  if (!report) notFound()

  // Fetch the related resume for context
  const resume = await db.query.resumesTable.findFirst({
    where: eq(resumesTable.id, report.resumeId),
  })

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link href="/reports" className="flex items-center text-blue-400 hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Reports
        </Link>
      </div>

      {/* Hero Section with Screening Chance */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">{report.jobTitle}</h1>
        <h2 className="mb-6 text-xl text-foreground/60">{report.companyName}</h2>

        <div className="bg-mixed rounded-lg border p-8">
          <div className="mb-4">
            <p className="text-lg text-foreground/70">Resume Screening Chance</p>
            <div className="text-6xl font-bold text-blue-400 mt-2">
              {report.resumeScreeningChance}
            </div>
          </div>

          <div className="text-sm text-foreground/50 space-y-1">
            <p>analyzed on: {new Date(report.createdAt).toLocaleDateString('en-US').replace(/\//g, '-')}</p>
            <p>resume used: {resume?.filename}</p>
            <p>
              job source:
              {report.scrapingSucceeded ? (
                <a
                  href={report.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-400 hover:underline"
                >
                  {report.jobUrl}
                </a>
              ) : (
                <span className="ml-1">manual input</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* What's Helping Section */}
      <div className="mb-8">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-green-400">
          <TrendingUp className="mr-3 h-6 w-6" />
          What&apos;s Helping Your Chances
        </h3>
        <div className="bg-mixed rounded-lg border border-green-400/20 p-6">
          <ul className="space-y-3">
            {formatCommaSeparatedList(report.strengthFactors).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 text-green-400 text-lg">•</span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* What's Hurting Section */}
      <div className="mb-8">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-red-400">
          <TrendingDown className="mr-3 h-6 w-6" />
          What&apos;s Hurting Your Chances
        </h3>
        <div className="bg-mixed rounded-lg border border-red-400/20 p-6">
          <ul className="space-y-3">
            {formatCommaSeparatedList(report.weaknessFactors).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 text-red-400 text-lg">•</span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvement Roadmap Section */}
      <div className="mb-8">
        <h3 className="mb-4 flex items-center text-xl font-semibold text-blue-400">
          <Lightbulb className="mr-3 h-6 w-6" />
          Improvement Roadmap
        </h3>
        <div className="bg-mixed rounded-lg border border-blue-400/20 p-6">
          <ul className="space-y-3">
            {formatCommaSeparatedList(report.improvementRoadmap).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 text-blue-400 text-lg">•</span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="text-center">
        <Link
          href="/reports/new"
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Analyze Another Job
        </Link>
      </div>
    </div>
  )
}
