"use server"

import { usersTable } from "@/drizzle/schema"
import { signIn } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export const signUp = async (state: unknown, fd: FormData) => {
  const email = (fd.get("email") as string)?.trim().toLowerCase()

  if (!email || !email.includes("@")) {
    return { error: "Invalid email", fd }
  }

  const exist = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  })

  if (exist) {
    return { error: "Email already in use", fd }
  }

  await db.insert(usersTable).values({ email })

  await signIn("nodemailer", {
    email,
    redirect: false,
    redirectTo: "/profile"
  })

  redirect("/verify")
}