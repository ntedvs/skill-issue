"use server"

import { usersTable } from "@/drizzle/schema"
import { signIn } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export const login = async (state: unknown, fd: FormData) => {
  const email = (fd.get("email") as string)?.trim().toLowerCase()

  if (!email || !email.includes("@")) {
    return { error: "Invalid email", fd }
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  })

  if (!user) {
    return { error: "No account found with this email", fd }
  }

  await signIn("nodemailer", {
    email,
    redirect: false,
    redirectTo: "/profile"
  })

  redirect("/verify")
}