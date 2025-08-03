import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { message }: { message: string } = await request.json()

  const ai = new GoogleGenAI({})

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
    })

    return NextResponse.json(response.text)
  } catch (error) {
    console.error(error)

    return NextResponse.error()
  }
}
