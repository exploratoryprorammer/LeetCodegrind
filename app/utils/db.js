import { MongoClient } from "mongodb"
const uri = process.env.MONGO_URI;

// Use default options for Atlas (no need for { tls: true })
const client = new MongoClient(uri);

export async function getProblemsCollection() {
  await client.connect();
  return client.db("leetcode").collection("problems")
}

export async function getUsersCollection() {
  await client.connect();
  return client.db("leetcode").collection("users")
}

export { client }
