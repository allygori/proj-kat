/**
 * Mongoose Connection Singleton
 * Prevents multiple connections in development (HMR)
 */

import mongoose from "mongoose";
import { config } from "../config";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use global cache to survive HMR in development
const globalWithMongoose = globalThis as typeof globalThis & {
  __mongoose: MongooseCache;
};

if (!globalWithMongoose.__mongoose) {
  globalWithMongoose.__mongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose.__mongoose;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(config.database.url, {
        bufferCommands: false,
      })
      .then((m) => {
        console.log("[REST] MongoDB connected");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
