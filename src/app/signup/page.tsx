import { Metadata } from "next"
import Form from "./form"

export const metadata: Metadata = { title: "Sign Up" }

export default function SignUp() {
  return (
    <>
      <h1 className="text-center text-3xl mb-8">Sign Up</h1>
      <Form />
    </>
  )
}