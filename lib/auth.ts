// Reference: AGENTS.md § 3.2 - Better-auth configuration with MongoDB
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
// import mongoose from "mongoose";
// import { db } from "@/lib/db"
// const client = await db.getClient();


import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();
const db = client.db();



// dbConnection.check();

// // Ensure your Mongoose connection is established first
// const client = mongoose.connection.getClient();
// const db = client.db();

export const auth = betterAuth({
  // database: mongodbAdapter(client),
  database: mongodbAdapter(db, {
    // client,
    // transaction: false // Disable if Replica Set is not available
  }), // Pass both db and client for session stability
  user: {
    modelName: "users"
  },
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    admin()
  ],
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID || '',
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  //   },
  // },
  advanced: {
    database: {
      generateId: false
    }
  }
});