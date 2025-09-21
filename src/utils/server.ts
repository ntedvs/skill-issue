import { PdfReader } from "pdfreader"

export const pdf = async (buffer: Buffer): Promise<string> => {
  const text: string[] = []

  return new Promise((resolve, reject) => {
    const reader = new PdfReader()

    reader.parseBuffer(buffer, (error, item) => {
      if (error) reject(error)
      else if (!item) resolve(text.join(" "))
      else if (item.text) text.push(item.text)
    })
  })
}
