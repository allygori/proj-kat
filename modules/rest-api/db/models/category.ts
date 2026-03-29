import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

export const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
