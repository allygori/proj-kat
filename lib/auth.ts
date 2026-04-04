// Reference: AGENTS.md § 3.2 - Better-auth configuration with MongoDB
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import mongoose from "mongoose";
import { db } from "@/lib/db"



const client = await db.getClient();

// dbConnection.check();

// // Ensure your Mongoose connection is established first
// const client = mongoose.connection.getClient();
// const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(client),
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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
});