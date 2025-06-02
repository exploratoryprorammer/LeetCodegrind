import { getUsersCollection } from "@/app/utils/db";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const {user} = await request.json();
    const collection = await getUsersCollection()
    const selecteduser = await collection.findOne({name: user})
    if (selecteduser){
        return NextResponse.json({data: selecteduser.friend_request ,success: true})
    }
    return NextResponse.json({success: false})

}