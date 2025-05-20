import { MongoClient } from "mongodb"
const uri = process.env.MONGO_URI || "mongodb+srv://rohanksah:mIVbewWjQ5HbROWN@leetcodecluster.krk2dri.mongodb.net/";

// Use default options for Atlas
const client = new MongoClient(uri);

export async function getProblemsCollection() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db("leetcode").collection("problems")
}

export { client }
