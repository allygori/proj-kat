## Plan: Complete Katalis Dental CMS MVP

Implement missing backend infrastructure (database, authentication, APIs) to connect the existing polished frontend, delivering a fully functional dentistry blog CMS with admin dashboard.

**Steps**

**Phase 1: Database Setup**
1. Create MongoDB connection in `lib/db.ts` using Mongoose.
2. Define Mongoose schemas in `models/` for BlogPost, User, Category, Tag, MediaAsset.
3. Set up environment variables (.env.local) for MongoDB URI and auth secrets.
4. Remove Payload CMS references from tsconfig.json and package.json.

**Phase 2: Authentication Implementation**
1. Configure better-auth in `lib/auth.ts` with MongoDB adapter, email/password/magic-link/social login.
2. Build auth pages in (auth) for login, signup, password reset.
3. Implement role-based middleware for protected routes (admin, editor, author).
4. Add session management and user context throughout the app.

**Phase 3: API Routes and CRUD**
1. Create API routes in api for blog posts, users, categories, tags CRUD operations.
2. Implement server actions for dashboard forms (create, edit, delete posts).
3. Connect blog frontend to real data instead of mocks.
4. Add Zod validation for all API inputs.

**Phase 4: Media Library** (In Progress)
1. Integrate Vercel Blob for file storage. (Done)
2. Build upload component and media CRUD in dashboard. (Skipped for now)
3. Update MediaAsset/Media model and link to blog posts. (Done)
4. Add image optimization and alt text handling.

**Phase 5: Integration and Polish**
1. Integrate TipTap rich editor into post forms.
2. Implement categories/tags management in dashboard.
3. Add SEO metadata handling and reading time calculation.
4. Refactor unnecessary client components to server components.

**Relevant files**
- `lib/db.ts` — MongoDB connection
- `models/blog-post.ts`, `models/user.ts`, etc. — Database schemas
- `lib/auth.ts` — better-auth config
- `app/(auth)/login/page.tsx` — Auth pages
- `app/api/posts/route.ts` — API endpoints

**Decisions**
- Implement better-auth with full feature set (email, magic link, Google social).
- Prioritize server components and actions for performance.