import { getUsersCollection } from "@/app/utils/db"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {from, user} = await request.json()
    const collection = await getUsersCollection();
    await collection.updateOne(
        { name: from},
        { $pull: {sent_request: user}}
    )
    await collection.updateOne(
        { name: user },
        { $pull: {friend_request: from}}
    )

  return NextResponse.json({ success: true });

}