"use client"

import { useActionState, useState } from "react"
import { renameResume } from "./actions"

type Resume = {
  id: string
  filename: string
  uploadedAt: Date
  skills: string
}

export default function ResumeCard({ resume }: { resume: Resume }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedFilename, setEditedFilename] = useState(resume.filename)
  const [state, formAction] = useActionState(renameResume, null)

  const handleEdit = () => {
    setIsEditing(true)
    setEditedFilename(resume.filename)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedFilename(resume.filename)
  }

  const handleSave = (formData: FormData) => {
    formData.append("resumeId", resume.id)
    formAction(formData)
  }

  return (
    <div className="bg-mixed rounded border p-4">
      {isEditing ? (
        <form action={handleSave}>
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              name="filename"
              value={editedFilename}
              onChange={(e) => setEditedFilename(e.target.value)}
              className="border-border bg-background flex-1 rounded border px-2 py-1 text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            >
              save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700"
            >
              cancel
            </button>
          </div>
          {state?.error && (
            <p className="mb-2 text-sm text-red-600">{state.error}</p>
          )}
        </form>
      ) : (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium">{resume.filename}</h3>
          <button
            onClick={handleEdit}
            className="text-foreground/60 hover:bg-background hover:text-foreground rounded px-2 py-1 text-sm"
          >
            edit
          </button>
        </div>
      )}

      <p className="text-foreground/60 mb-2 text-sm">
        uploaded:{" "}
        {new Date(resume.uploadedAt)
          .toLocaleString("en-US")
          .replace(/\//g, "-")
          .replace(/,/g, "")}
      </p>
      <div className="text-sm">
        <span className="font-medium">skills: </span>
        <span className="text-foreground/70">
          {resume.skills.length > 100
            ? resume.skills.substring(0, 100) + "..."
            : resume.skills}
        </span>
      </div>
    </div>
  )
}
