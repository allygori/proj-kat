<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Dentistry related blog and content management system

This file serves as the **single source of truth** and primary context document for any AI coding assistant (GitHub Copilot, Claude, OpenAI, Cursor, Continue.dev, etc.) working inside this repository. All code suggestions, file creations, refactors, and architectural decisions **must** strictly follow the requirements and philosophy outlined here.

## 1. Project Overview & Vision

**Project Name**: Katalis Dental (or without Dental)

We are building a **fully custom, monolithic, highly flexible** content management system tailored for a professional dentistry blog. The client (a practicing dentist) wants to publish:
- Opinion articles
- Clinical case studies
- Product reviews content
- Affiliate content from Indonesian marketplaces (Tokopedia, Shopee, etc.)

The system must feel **premium, trustworthy, and medical-grade** in UI/UX while being **extremely easy to customize** at the Admin Panel level — the exact reason we are **not** using Payload CMS (insufficient Admin UI flexibility).

**Core Philosophy**:
- Monolithic Next.js application (App Router)
- Maximum customizability of the dashboard/admin panel
- Clean separation of concerns but kept in one repo for speed
- Future-proof for e-commerce expansion (physical products, digital downloads, online courses)
- SEO-first blog with excellent performance
- Professional dental aesthetic (clean whites, blues, greens, medical icons)

## 2. Tech Stack (Locked)

| Layer              | Technology                          | Version / Notes                          |
|--------------------|-------------------------------------|------------------------------------------|
| Framework          | Next.js                             | 16.2.1 (latest as of April 2026)        |
| Styling            | Tailwind CSS                        | Latest                                   |
| UI Component Library | Shadcn/UI                        | Latest (fully customizable)              |
| Database           | MongoDB                             | Atlas or self-hosted                     |
| Auth               | better-auth                         | Latest — must use its full feature set   |
| ORM / DB Layer     | **Mongoose** (preferred) or Drizzle | Choose based on schema complexity        |
| Deployment         | Vercel (primary)                    | Ready for server actions & edge          |
| Editor             | VS Code + GitHub Copilot            | All suggestions must respect this file   |

**No other frameworks or heavy CMS** (no Payload, no Strapi, no Sanity unless explicitly approved later).

## 3. Core Features (MVP — Phase 1)

### 3.1 Public Frontend (Blog)
- Clean, professional dentistry-themed design
- Dark/light mode (default: light with medical feel)
- Responsive mobile-first
- Homepage with hero, latest posts, featured case studies
- Blog listing with filters (category, tag, search)
- Individual post page with table of contents, share buttons, related posts
- Image and Font Optimization from Next.js docs
- Excellent Core Web Vitals & SEO (next-seo or metadata API), very important for blog index and individual post pages

### 3.2 Authentication & Users
- Powered exclusively by **better-auth**
- Roles: `admin`, `editor`, `author`
- Email + password + magic link + social (Google) login
- Protected routes using better-auth middleware

### 3.3 Admin Dashboard (Shadcn/UI)
- Highly customizable, beautiful, responsive dashboard
- Sidebar navigation with collapsible sections
- Dark/light mode (default: light with medical feel)
- Top bar with user avatar, notifications, quick publish button
- **Critical requirement**: Every table, form, and modal must be built with Shadcn components so the client (or future devs) can easily customize styling and layout without fighting a rigid CMS UI.

**Main sections**:
- Dashboard Home (analytics overview: posts published, views, etc.)
- Blog Posts (CRUD + rich editor)
- Media Library (upload, organize, search images/videos)
- Categories & Tags
- Users & Roles (future)
- Settings (SEO defaults, site info, affiliate disclosures)

### 3.4 Blog Management
- Rich text editor: **TipTap** (or latest stable alternative) with dental-friendly toolbar
- Frontmatter fields:
  - Title, slug (auto-generated + manual override)
  - Excerpt
  - Body (TipTap content blocks json)
  - Featured image (populated from Media Library)
  - Categories (hierarchical max 3 levels)
  - Tags (multi-select) (max 3, can create new tag from right-side drawer)
  - Author (linked to user)
  - Published status + scheduled publish date
  - Meta title, meta description, og:image
  - Reading time (auto-calculated)
  - Related posts (future)
- Support for embedded media, dental case study galleries, before/after sliders
- SEO-friendly URLs: `/blog/[slug]`

### 3.5 Media Library
- Upload images, videos, PDFs to third party like Vercel Blob, but all metadata should stored in database 
- Automatic optimization (Next.js Image + Sharp)
- Folder organization / collections (optional)
- Alt text, captions, credits
- Direct URL access for blog embedding

## 4. Project Structure

```bash
/app
├──── (auth)            # better-auth routes
├──── (dashboard)       # /dashboard/* — protected admin
│     ├── layout.tsx
│     ├── page.tsx
│     ├── posts/
│     ├── media/
│     └── ...
├──── blog            # public blog routes
│     └── page.tsx
├──── api/              # only if needed (better-auth handles most)
├── components/
│   ├── ui/             # shadcn components
│   ├── dashboard/      # admin-specific
│   ├── blog/           # public blog components
│   └── common/
├── lib/
│   ├── db.ts           # MongoDB connection
│   ├── auth.ts         # better-auth config
│   └── utils.ts
├── models/             # Mongoose schemas
├── hooks/              # React hooks
├── constant/
├── styles/
├── public/
└── types/
```

Use App Router exclusively. Server Components by default. Server Actions for mutations.

## 5. Coding Standards & Agent Instructions
Always follow these rules when suggesting or generating code:

1. TypeScript strict mode — no any, proper interfaces.
2. Use Server Components and Server Actions wherever possible.
3. Tailwind classes must be clean and consistent (use @apply sparingly).
4. All forms use React Hook Form + Zod validation.
5. Error handling with proper user-facing messages.
6. Loading states with Shadcn skeletons.
7. Accessibility (ARIA labels, keyboard navigation) — medical site standard.
8. Comment complex logic or dental-specific business rules.
9. Keep components < 300 lines; extract early.
10. Never suggest installing heavy CMS packages.

When creating new files:
- Start with a clear comment block referencing this AGENTS.md
- Include necessary imports and types
- Provide both the component and any required schema/model changes

Naming Convention:
- Files: kebab-case
- Database collections: snake_case (e.g., blog_posts, media)
- Database fields: snake_case (e.g., title, created_at)
- React components: PascalCase
- Mongoose models: PascalCase

## 6. Database Schema (High-Level)
Key Mongoose Models (expand as needed):
- User (better-auth integration)
- BlogPost
- Category
- Tag
- MediaAsset
- Product (future)
- Review (future)

All models must include `created_at`, `updated_at`, and soft-delete where appropriate.

## 7. Design & Branding Guidelines
- Primary colors: Medical blue, clean white, soft gray
- Font: best font for human readability
- Professional, trustworthy, modern dental clinic feel
- All images must look clinical/professional

## 8. Future-Proof Extensions (Phase 2+)

The architecture **must** be designed from day one to easily add:
- E-commerce storefront (physical dental products, digital courses, e-books)
- Product review system with affiliate links (Tokopedia/Shopee)
- Course platform (lessons, quizzes, certificates)
- Newsletter integration
- Analytics dashboard (PostHog or Umami)

All new features must reuse existing UI components and auth system.

## 9. How to Use This File
When I (or any developer) open a new chat with Copilot or any agent inside this project:
- The agent must read this entire AGENTS.md first.
- Every response should start with a short confirmation of which section of the requirements is being addressed.
- If something is unclear, ask for clarification before writing code.

This document will be updated as the project evolves. Any major architectural changes must be reflected here first.
