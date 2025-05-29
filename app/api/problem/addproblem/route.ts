import { getProblemsCollection } from "../../../utils/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const {coder, title } = await request.json()
    const collection = await getProblemsCollection();
    const result = await collection.insertOne({
        coder, 
        title,
        date: new Date()
    })
    return NextResponse.json({ success: true, id: result.insertedId})
    
}