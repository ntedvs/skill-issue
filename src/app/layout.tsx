import { auth } from "@/lib/auth"
import "@/styles/base.css"
import { Metadata } from "next"
import { Source_Code_Pro } from "next/font/google"
import Link from "next/link"
import { ReactNode } from "react"

const source = Source_Code_Pro()

export const metadata: Metadata = {
  title: { default: "skill-issue", template: "%s | skill-issue" },
}

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth()

  return (
    <html lang="en">
      <body
        className={`bg-background text-foreground flex min-h-screen flex-col ${source.className}`}
      >
        <header className="bg-mixed w-full">
          <div className="mx-auto grid max-w-6xl grid-cols-3 items-center p-4">
            {/* Left: Brand */}
            <div>
              <Link href="/" className="">
                <span className="text-blue-400">skill</span>
                -issue
              </Link>
            </div>

            {/* Middle: Navigation */}
            <div className="flex justify-center space-x-1 font-bold">
              <Link href="/" className="hover:underline">
                home
              </Link>
              <span>|</span>
              <Link href="/reports" className="hover:underline">
                reports
              </Link>
              <span>|</span>
              <Link href="/reports/new" className="hover:underline">
                analyze
              </Link>
            </div>

            {/* Right: Auth */}
            <div className="flex justify-end space-x-1 font-bold">
              {session ? (
                <Link href="/profile" className="hover:underline">
                  profile
                </Link>
              ) : (
                <>
                  <Link href="/login" className="hover:underline">
                    login
                  </Link>
                  <span>|</span>
                  <Link href="/signup" className="hover:underline">
                    signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl grow p-4">{children}</main>

        <footer className="text-foreground/60 mx-auto w-full max-w-6xl p-4 text-center">
          <p>© {new Date().getFullYear()} skill-issue. all rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
