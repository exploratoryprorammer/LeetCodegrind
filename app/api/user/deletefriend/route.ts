import { getUsersCollection } from "@/app/utils/db";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const {user, friend} = await request.json();
    const collection = await getUsersCollection()
    await collection.updateOne(
        { name: user},
        { $pull: {friends: friend}}
    )
    await collection.updateOne(
        {name: friend},
        { $pull: {friends: user}}
    )
    return NextResponse.json({success: true})
}