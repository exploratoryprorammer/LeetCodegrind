import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

const ai = new GoogleGenAI({ apiKey: process.env.GEMENI_API})

export async function POST(request: Request) {
    const { prompt } = await request.json()
    if (prompt) {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are a leetcode problems and data structures and algorithms instructor. You are an expert in the neetcode 150 problems. When asked a problem you give hints like the data structures to use and also take  "
            }
        }) 
        const airesponse = response.candidates?.[0]?.content?.parts?.[0]?.text ?? null
        return NextResponse.json({res: airesponse, code: 200})
    }
    return NextResponse.json({res: "Not found", code: 400})
}

