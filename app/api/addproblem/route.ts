import { dbConnect } from "../../db/db"
import Problem from "../../model/Problem"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    await dbConnect()
    const {coder, title } = await request.json()
    const problems = await Problem.create({ coder, title})
    return NextResponse.json({problems})
    
}