// Reference: AGENTS.md - User Mongoose schema for better-auth integration
// import mongoose from 'mongoose';
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    // better-auth fields
    email: { type: String, required: true, unique: true },
    name: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
    // Custom fields
    role: { type: String, enum: ['admin', 'editor', 'author'], default: 'author' },
    username: { type: String },
    deleted_at: { type: Date }, // soft delete
  },
  {
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  } // Automatically handles createdAt and updatedAt
);

const User = models.User || model('User', UserSchema);

export default User;