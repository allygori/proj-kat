import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IMedia extends Document {
  _id: mongoose.Types.ObjectId;
  filename: string;
  url: string;
  thumbnail_url?: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  uploaded_by: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    thumbnail_url: { type: String },
    mime_type: { type: String, required: true },
    file_size: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    alt: { type: String },
    caption: { type: String },
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "media",
  }
);

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
