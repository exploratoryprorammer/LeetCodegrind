import mongoose from "mongoose";

const personscheme = new mongoose.Schema({
    name: String,
    friends: [String],
    friend_request: [String],
    sent_request: [String],
    daily_goal: Number,
    summer_goal: Number,
})