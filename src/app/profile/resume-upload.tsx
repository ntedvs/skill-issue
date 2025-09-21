"use client"

import SubmitButton from "@/components/submit-button"
import { useState } from "react"
import { uploadResume } from "./actions"

export default function ResumeUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
  }

  return (
    <div className="mb-8">
      <form action={uploadResume}>
        <label htmlFor="resume" className="mb-2 block font-medium">
          resume:
        </label>
        <div className="space-y-3">
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => document.getElementById("resume")?.click()}
            className="button w-full"
          >
            choose file
          </button>

          {selectedFile && (
            <p className="text-sm text-foreground/60">
              selected: {selectedFile.name}
            </p>
          )}

          <SubmitButton
            loadingText="uploading..."
            disabled={!selectedFile}
          >
            {!selectedFile ? "choose a file first" : "upload resume"}
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
