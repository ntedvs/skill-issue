"use client"

import { deleteReport } from "./actions"

interface DeleteButtonProps {
  reportId: string
  jobTitle: string
}

export default function DeleteButton({ reportId, jobTitle }: DeleteButtonProps) {
  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const confirmed = window.confirm(
      `Are you sure you want to delete the report for "${jobTitle}"? This action cannot be undone.`,
    )

    if (confirmed) {
      const form = event.currentTarget
      const formData = new FormData(form)
      deleteReport(formData)
    }
  }

  return (
    <form onSubmit={handleDelete} className="absolute right-2 top-2">
      <input type="hidden" name="reportId" value={reportId} />
      <button
        type="submit"
        className="rounded bg-red-600 p-1.5 text-white opacity-60 hover:bg-red-700 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-opacity"
        title={`Delete report for ${jobTitle}`}
      >
        ×
      </button>
    </form>
  )
}