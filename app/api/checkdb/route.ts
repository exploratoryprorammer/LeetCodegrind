import { dbConnect } from "../../db/db";
import { NextResponse } from 'next/server'

export async function GET() {
    await dbConnect()
    return new NextResponse('MongoDB has been connected');
    
}