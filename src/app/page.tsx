import Link from "next/link"

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 mt-8 text-center text-6xl">
        <span className="text-blue-400">skill</span>-issue
      </h1>

      <p className="mb-6 text-center text-foreground/40">
        analyze your job application competitiveness with ai-powered insights.
        upload your resume, paste a job posting, and get detailed feedback on
        your skill gaps and improvement recommendations.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-mixed rounded border p-4">
          <h3 className="mb-2 font-medium">upload resume</h3>
          <p className="text-sm text-foreground/60">
            upload your pdf resume and let ai extract your skills and experience
          </p>
        </div>

        <div className="bg-mixed rounded border p-4">
          <h3 className="mb-2 font-medium">analyze jobs</h3>
          <p className="text-sm text-foreground/60">
            paste job posting urls to get instant compatibility analysis
          </p>
        </div>

        <div className="bg-mixed rounded border p-4">
          <h3 className="mb-2 font-medium">improve skills</h3>
          <p className="text-sm text-foreground/60">
            get actionable recommendations to boost your candidacy
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/profile"
          className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Get Started - Upload Your Resume
        </Link>
      </div>
    </div>
  )
}
