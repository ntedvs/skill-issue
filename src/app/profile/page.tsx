import { resumesTable } from "@/drizzle/schema"
import { auth, signOut } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { desc, eq } from "drizzle-orm"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import ResumeCard from "./resume-card"
import ResumeUpload from "./resume-upload"

export const metadata: Metadata = { title: "Profile" }

export default async function Profile() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's resumes
  const resumes = await db.query.resumesTable.findMany({
    where: eq(resumesTable.userId, session.user.id),
    orderBy: desc(resumesTable.uploadedAt),
  })

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 mt-8 text-center text-6xl">profile</h1>

      <p className="text-foreground/40 mb-6 text-center">
        manage your resumes and account settings
      </p>

      <ResumeUpload />

      {resumes.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-center text-xl font-medium">your resumes</h2>
          <div className="grid grid-cols-1 gap-4">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-foreground/60 mb-4 text-sm">
          signed in as: {session.user.email}
        </p>
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <button type="submit" className="button">
            sign out
          </button>
        </form>
      </div>
    </div>
  )
}
