"use client"

import { Resume } from "@/drizzle/schema"
import SubmitButton from "@/components/submit-button"
import { useActionState, useState } from "react"
import { analyzeJob } from "./actions"

interface AnalysisFormProps {
  resumes: Resume[]
}

export default function AnalysisForm({ resumes }: AnalysisFormProps) {
  const [state, action] = useActionState(analyzeJob, undefined)
  const [selectedResumeId, setSelectedResumeId] = useState(
    state ? (state.fd?.get("resumeId") as string) : "",
  )

  return (
    <form action={action} className="space-y-6">
      {!state?.scrapingFailed ? (
        <div>
          <label htmlFor="jobUrl" className="mb-2 block font-medium">
            job posting url:
          </label>
          <input
            id="jobUrl"
            name="jobUrl"
            type="url"
            required
            placeholder="https://example.com/job-posting"
            className="bg-mixed border-foreground/30 w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
            defaultValue={state && (state.fd?.get("jobUrl") as string)}
          />
        </div>
      ) : (
        <div>
          <label htmlFor="manualJobContent" className="mb-2 block font-medium">
            job description:
          </label>
          <textarea
            id="manualJobContent"
            name="manualJobContent"
            rows={8}
            required
            placeholder="paste the full job description here..."
            className="bg-mixed border-foreground/30 w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
            defaultValue={
              state && (state.fd?.get("manualJobContent") as string)
            }
          />
          <p className="mt-1 text-sm text-yellow-600">
            automatic scraping failed. please paste the job description
            manually.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="resumeId" className="mb-2 block font-medium">
          select resume:
        </label>
        <select
          id="resumeId"
          name="resumeId"
          required
          className={`bg-mixed border-foreground/30 w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none ${
            !selectedResumeId ? "text-foreground/40" : "text-foreground"
          }`}
          value={selectedResumeId}
          onChange={(e) => setSelectedResumeId(e.target.value)}
        >
          <option value="" disabled className="text-foreground/40">
            choose a resume...
          </option>
          {resumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {resume.filename} (uploaded{" "}
              {new Date(resume.uploadedAt)
                .toLocaleDateString("en-US")
                .replace(/\//g, "-")}
              )
            </option>
          ))}
        </select>
      </div>

      {state?.error && <p className="text-red-500">{state.error}</p>}

      <SubmitButton scrapingFailed={state?.scrapingFailed} loadingText="analyzing..." />
    </form>
  )
}
