import { dbConnect } from "../../db/db";
import Problem from "../../model/Problem";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    const { coder } = await request.json()
    if (!coder) return NextResponse.json({ problem: [] })
    const problems = await Problem.find({coder}).sort({ date: -1 })
    return NextResponse.json({ problems })
}