import { MongoClient, ServerApiVersion } from "mongodb"
const uri = process.env.MONGO_URI || "mongodb+srv://rohanksah:mIVbewWjQ5HbROWN@leetcodecluster.krk2dri.mongodb.net/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

export async function getProblemsCollection() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db("leetcode").collection("problems")
}

export { client }
