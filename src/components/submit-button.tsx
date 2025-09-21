"use client"

import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
  children?: React.ReactNode
  loadingText?: string
  className?: string
  scrapingFailed?: boolean
  disabled?: boolean
}

export default function SubmitButton({
  children,
  loadingText = "submitting...",
  className = "",
  scrapingFailed,
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  const defaultText = scrapingFailed
    ? "analyze with manual content"
    : "analyze job match"

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`w-full rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        pending
          ? "cursor-not-allowed bg-blue-400"
          : disabled
          ? "cursor-not-allowed bg-gray-400"
          : "bg-blue-600 hover:bg-blue-700"
      } ${className}`}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </div>
      ) : (
        children || defaultText
      )}
    </button>
  )
}
