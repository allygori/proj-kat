'use client';

import { ReactNode } from 'react';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';

/**
 * Blog Layout
 * Refined minimalist design for the public-facing dental blog.
 * Provides consistent header, footer, and responsive layout.
 * 
 * See AGENTS.md § 3.1 for blog frontend specifications.
 */

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with navigation and theme toggle */}
      <BlogHeader />

      {/* Main content area with generous top/bottom padding */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer with links and metadata */}
      <BlogFooter />
    </div>
  );
}
