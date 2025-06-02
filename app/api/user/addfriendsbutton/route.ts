import { getUsersCollection } from "@/app/utils/db";
import { NextResponse } from "next/server";


export async function GET() {
    const collection = await getUsersCollection()
    const users = await collection.find({}).toArray();
    const usernames = users.map(user => user.name)
    return NextResponse.json({data: usernames})
}