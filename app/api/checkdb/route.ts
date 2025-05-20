import { run } from "../../db/db";
import { NextResponse } from 'next/server'

export async function GET() {
    await run();
    return new NextResponse('MongoDB has been connected');
    
}