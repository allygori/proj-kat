// Reference: AGENTS.md § 3.1 — Blog layout wraps all /blog/* public routes
// Note: homepage (/) uses the root layout directly, not this one.

import { ReactNode } from 'react';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <BlogHeader />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
