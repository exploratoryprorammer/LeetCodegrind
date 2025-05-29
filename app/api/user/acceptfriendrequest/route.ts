import { getUsersCollection } from "@/app/utils/db"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { user, from } = await request.json()
    const collection = await getUsersCollection()
    await collection.updateOne(
        {name: user},
        {
            $addToSet: {friends: from},
            $pull: {friend_request: from}
        }
    );
    await collection.updateOne(
        {name: from},
        {
            $addToSet: {friends: user},
            $pull: { sent_request: user}
        }
    );
    return NextResponse.json({success: true})
    
}