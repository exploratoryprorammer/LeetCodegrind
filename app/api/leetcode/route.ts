import { LeetCode } from "leetcode-query"
import { NextResponse } from "next/server";


export async function GET() {
    const leetcode = new LeetCode();
    const data = await leetcode.problems()
    const filtered = data.questions.map(a =>  a.title)
    return NextResponse.json({titles: filtered, success: true})
}

