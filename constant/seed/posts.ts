import { z } from "zod";
import { ZodPostSchema } from "@/lib/validations";
import { authors } from "./authors";
import { categories } from "./categories";
import { tags } from "./tags";
import { seedMedia } from "./media";
// import { nanoid } from "nanoid";
import { genPostNid } from "@/lib/nano-id";


type BlogPost = z.infer<typeof ZodPostSchema>;

export const mockPosts: BlogPost[] = [
  {
    title: 'The Complete Guide to Modern Teeth Whitening',
    slug: 'complete-guide-teeth-whitening',
    nid: genPostNid(7),
    excerpt: 'Discover the latest teeth whitening techniques, from professional treatments to at-home solutions. Learn what works and what to avoid.',
    content: '<p>Teeth whitening is one of the most requested cosmetic dental procedures.</p>',
    content_blocks: [
      {
        type: 'paragraph',
        attrs: {},
        content: {},
        marks: {}
      }
    ],
    featured_image: seedMedia.id,
    category: categories[0].id,
    tags: [tags[0].id, tags[1].id, tags[2].id],
    published_status: 'published',
    published_at: new Date('2024-03-15').toISOString(),
    metadata: {
      title: 'Complete Guide to Teeth Whitening | Katalis Dental Blog',
      description: 'Learn about professional and at-home teeth whitening treatments. Discover which methods are most effective and safe.',
      image: seedMedia.id
    },
    author: authors[0].id,
    reading_time: 8,
    related_posts: [],
  },
  {
    title: 'Dental Implants vs Bridges: A Detailed Comparison',
    slug: 'implant-vs-bridge-comparison',
    nid: genPostNid(7),
    excerpt: 'Deciding between implants and bridges? This detailed comparison explores the pros, cons, costs, and longevity of each option.',
    content: '<p>When you lose a tooth, two of the most popular restorative options are dental implants and bridges.</p>',
    content_blocks: [
      {
        type: 'paragraph',
        attrs: {},
        content: {},
        marks: {}
      }
    ],
    featured_image: seedMedia.id,
    category: categories[0].id,
    tags: [tags[2].id, tags[3].id],
    published_status: 'published',
    published_at: new Date('2024-03-10').toISOString(),
    metadata: {
      title: 'Dental Implants vs Bridges: Complete Comparison | Katalis',
      description: 'Compare dental implants and bridges. Understand the advantages, disadvantages, costs, and which option might be right for you.',
      image: seedMedia.id
    },
    author: authors[1].id,
    reading_time: 10,
    related_posts: [],
  },
  {
    title: 'Are Electric Toothbrushes Really Better? What Science Says',
    slug: 'electric-toothbrush-benefits',
    nid: genPostNid(7),
    excerpt: 'We examine the research on electric toothbrushes. Are they worth the investment? Here\'s what dentists recommend.',
    content: '<p>Multiple clinical studies consistently show that electric toothbrushes are slightly more effective.</p>',
    content_blocks: [
      {
        type: 'paragraph',
        attrs: {},
        content: {},
        marks: {}
      }
    ],
    featured_image: seedMedia.id,
    category: categories[3].id,
    tags: [tags[3].id],
    published_status: 'published',
    published_at: new Date('2024-03-05').toISOString(),
    metadata: {
      title: 'Electric Toothbrushes: Science-Based Review | Katalis Dental',
      description: 'Do electric toothbrushes really improve oral health? Read what dental research says about their effectiveness.',
      image: seedMedia.id
    },
    author: authors[2].id,
    reading_time: 6,
    related_posts: [],
  }
];
