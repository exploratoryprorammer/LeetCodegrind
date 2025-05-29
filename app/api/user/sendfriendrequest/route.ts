import { getUsersCollection } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { from, to } = await request.json();
    const collection = await getUsersCollection();
    await collection.updateOne(
        { name: to },
        { $addToSet: { friend_request: from } }
    );
    await collection.updateOne(
        { name: from },
        { $addToSet: { sent_request: to } }
    );
    return NextResponse.json({success: true})
}
