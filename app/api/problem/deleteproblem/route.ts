import { ObjectId } from "mongodb"
import { getProblemsCollection } from "../../../utils/db"
import { NextResponse } from "next/server"

export async function DELETE(request: Request)
{
    const { id } = await request.json()
    if(!id) return NextResponse.json({success: false, error: "No id provided"})
    const collection = await getProblemsCollection();
    await collection.deleteOne({_id: new ObjectId(id) });
    return NextResponse.json({success: true})
}