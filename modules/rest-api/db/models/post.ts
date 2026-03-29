import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISeo {
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
}

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt?: string;
  body?: Record<string, unknown>; // Tiptap/Lexical JSON
  featured_image?: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
  tags: mongoose.Types.ObjectId[];
  status: "draft" | "published" | "archived";
  author: mongoose.Types.ObjectId;
  published_at?: Date;
  seo?: ISeo;
  deleted_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SeoSchema = new Schema<ISeo>(
  {
    meta_title: { type: String },
    meta_description: { type: String },
    og_image: { type: String },
  },
  { _id: false }
);

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String },
    body: { type: Schema.Types.Mixed },
    featured_image: { type: Schema.Types.ObjectId, ref: "Media" },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    published_at: { type: Date },
    seo: { type: SeoSchema },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "posts",
  }
);

// Text index for search
PostSchema.index({ title: "text", excerpt: "text" });

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
