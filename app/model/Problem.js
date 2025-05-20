import mongoose from "mongoose"

const problemschema = new mongoose.Schema({
    coder: String,
    title: String,
    date: { type: Date, default: Date.now}
})

export default mongoose.models.Problem || mongoose.model("Problem", problemschema)