import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IVerification extends Document {
  _id: mongoose.Types.ObjectId;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    identifier: { type: String, required: true },
    value: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: "verifications",
  }
);

export const Verification: Model<IVerification> =
  mongoose.models.Verification ||
  mongoose.model<IVerification>("Verification", VerificationSchema);
