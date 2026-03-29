import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ITag extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  {
    timestamps: true,
    collection: "tags",
  }
);

export const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
