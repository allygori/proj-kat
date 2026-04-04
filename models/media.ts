// Reference: AGENTS.md - Media Mongoose schema
import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    original_name: { type: String, required: true },
    mime_type: { type: String, required: true },
    size: { type: Number, required: true }, // in bytes
    url: { type: String, required: true }, // Vercel Blob URL
    alt_text: { type: String },
    caption: { type: String },
    credits: { type: String },
    folder: { type: String }, // optional organization
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deleted_at: { type: Date }, // soft delete
  },
  {
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  } // Automatically handles createdAt and updatedAt
);

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);