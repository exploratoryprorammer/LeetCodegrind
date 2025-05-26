import { LeetCode } from "leetcode-query"
import { use } from "react";


export async function POST(request: Request) {
    const { username } = await request.json()
    const leetcode = new LeetCode();
    const user = await leetcode.user(username)
}

