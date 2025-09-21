import { Metadata } from "next"

export const metadata: Metadata = { title: "Check Your Email" }

export default function Verify() {
  return (
    <div className="mx-auto max-w-96 text-center">
      <h1 className="text-3xl mb-8">Check Your Email</h1>

      <p className="mb-4">
        We&apos;ve sent you a magic link! Click the link in your email to sign in.
      </p>

      <p className="text-sm text-gray-600">
        The link will expire in 24 hours. If you don&apos;t see the email, check your spam folder.
      </p>
    </div>
  )
}