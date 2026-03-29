/**
 * Better Auth — Server Instance
 *
 * Uses the native MongoDB adapter with the mongoose connection's
 * underlying MongoClient so both better-auth and the rest of the app
 * share a single connection pool.
 */

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import { config } from "../config";
import { connectDB } from "../db/connection";

let _auth: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
  if (_auth) return _auth;

  // Ensure mongoose is connected first
  await connectDB();

  const db = mongoose.connection.getClient().db();

  _auth = betterAuth({
    database: mongodbAdapter(db),
    baseURL: config.auth.baseURL,
    secret: config.auth.secret,
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      ...(config.auth.google.clientId
        ? {
            google: {
              clientId: config.auth.google.clientId,
              clientSecret: config.auth.google.clientSecret,
            },
          }
        : {}),
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "reader",
          input: false,
        },
        bio: {
          type: "string",
          required: false,
          input: true,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24,      // 1 day
    },
  });

  return _auth;
}

// Re-export type helper
export type Auth = Awaited<ReturnType<typeof getAuth>>;
