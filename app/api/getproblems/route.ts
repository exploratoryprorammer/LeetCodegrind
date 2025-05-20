;
import { getProblemsCollection } from "../../db/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { coder } = await request.json()
    if (!coder) return NextResponse.json({ problem: [] })
    const collection = await getProblemsCollection();
    const problems = await collection.find({coder}).sort({date: -1}).toArray();
    return NextResponse.json({ problems })
}