// Reference: AGENTS.md - BlogPost Mongoose schema
import { Schema, models, model } from "mongoose";
import User from "./user";
import Category from "./category";
import Tag from "./tag";
import Media from "./media";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    nid: { type: String }, // Nano id
    excerpt: { type: String },
    content: { type: String, required: false },      // JSON stringified
    content_html: { type: String, required: false }, // HTML content
    // content_blocks: [ // TipTap content blocks JSON
    //   {
    //     type: { type: String, required: true }, // e.g., 'paragraph', 'heading', 'image'
    //     attrs: { type: Schema.Types.Mixed }, // e.g., { src: '...' }
    //     content: [Schema.Types.Mixed], // Nested inline content
    //     marks: [Schema.Types.Mixed], // e.g., bold, italic
    //   }
    // ],
    // content_blocks: [ // TipTap content blocks JSON
    //   {
    //     type: { type: String, required: true }, // e.g., 'paragraph', 'heading', 'image'
    //     content: [Schema.Types.Mixed], // Nested inline content
    //     props: { type: Schema.Types.Mixed }, // e.g., bold, italic
    //     children: [Schema.Types.Mixed],
    //   }
    // ],
    content_blocks: [ // TipTap content blocks JSON
      Schema.Types.Mixed
    ],
    featured_image: { type: Schema.Types.ObjectId, ref: Media }, // URL from Media Library
    // categories: [{ type: Schema.Types.ObjectId, ref: Category }], // hierarchical max 3 levels
    category: { type: Schema.Types.ObjectId, ref: Category }, // hierarchical max 3 levels
    tags: [{ type: Schema.Types.ObjectId, ref: Tag }], // max 3
    author: { type: Schema.Types.ObjectId, ref: User, required: true },
    published_status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    published_at: { type: Date },
    scheduled_publish_date: { type: Date },
    metadata: {
      title: { type: String },
      description: { type: String },
      image: { type: Schema.Types.ObjectId, ref: Media },
    },
    reading_time: { type: Number },
    related_posts: [{ type: Schema.Types.ObjectId, ref: "BlogPost" }],
    deleted_at: { type: Date }, // soft delete
  },
  {
    collection: 'blog-posts',
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  }, // Automatically handles created_at and updated_at
);

const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);

export default BlogPost;