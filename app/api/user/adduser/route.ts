import { getUsersCollection } from "@/app/utils/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const { name } = await request.json()
    const collection = await getUsersCollection()
    const existing = await collection.findOne({ name })
    if(!existing) {
        await collection.insertOne({ name, friends: [], friend_request: [], sent_request: [], daily_goal: 2, summer_goal: 150})
    }
    return NextResponse.json({ success: true})
}