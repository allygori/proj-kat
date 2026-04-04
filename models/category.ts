// Reference: AGENTS.md - Category Mongoose schema (hierarchical max 3 levels)
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // for hierarchy
    level: { type: Number, default: 1, max: 3 }, // max 3 levels
    deleted_at: { type: Date }, // soft delete
  },
  {
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  } // Automatically handles createdAt and updatedAt
);

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);