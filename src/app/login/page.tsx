import { Metadata } from "next"
import Form from "./form"

export const metadata: Metadata = { title: "log in" }

export default function Login() {
  return (
    <>
      <h1 className="text-center text-3xl mb-8">log in</h1>
      <Form />
    </>
  )
}