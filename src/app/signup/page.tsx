import { Metadata } from "next"
import Form from "./form"

export const metadata: Metadata = { title: "sign up" }

export default function SignUp() {
  return (
    <>
      <h1 className="text-center text-3xl mb-8">sign up</h1>
      <Form />
    </>
  )
}