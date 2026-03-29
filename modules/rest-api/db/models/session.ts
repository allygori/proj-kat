import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
    collection: "sessions",
  }
);

export const Session: Model<ISession> =
  mongoose.models.Session ||
  mongoose.model<ISession>("Session", SessionSchema);
