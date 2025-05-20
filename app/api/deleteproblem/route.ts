import { error } from "console"
import { dbConnect } from "../../db/db"
import Problem from "../../model/Problem"
import { NextResponse } from "next/server"

export async function DELETE(request: Request)
{
    await dbConnect()
    const { id } = await request.json()
    if(!id) return NextResponse.json({success: false, error: "No id provided"})
    await Problem.findByIdAndDelete(id);
    return NextResponse.json({success: true})
}