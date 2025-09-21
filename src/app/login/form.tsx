"use client"

import Link from "next/link"
import { useActionState } from "react"
import { login } from "./actions"

export default function Form() {
  const [state, action] = useActionState(login, undefined)

  return (
    <form action={action} className="mx-auto flex max-w-96 flex-col">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        className="input mb-4"
        defaultValue={state && (state.fd.get("email") as string)}
      />

      {state && (
        <p className="-mt-2 mb-2 text-center text-red-500">{state.error}</p>
      )}

      <button type="submit" className="button">
        Log In
      </button>

      <Link href="/signup" className="mt-2 w-fit text-blue-600">
        Don't have an account?
      </Link>
    </form>
  )
}