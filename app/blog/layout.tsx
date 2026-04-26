import { ReactNode } from 'react';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="flex min-h-screen relative w-full flex-col bg-white dark:bg-slate-950">
      <div
        className="fixed inset-0 z-0 bg-[radial-gradient(125%_125%_at_50%_90%,#fff_40%,#c9e8e9_100%)] dark:bg-transparent dark:relative dark:hidden"
      />

      <BlogHeader />
      <main className="flex-1 z-10">{children}</main>
      <BlogFooter className="z-10" />
    </div>
  );
}
