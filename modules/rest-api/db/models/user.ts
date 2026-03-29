import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "admin" | "author" | "reader";
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    role: {
      type: String,
      enum: ["admin", "author", "reader"],
      default: "reader",
    },
    bio: { type: String },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
