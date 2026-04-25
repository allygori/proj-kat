// Reference: AGENTS.md § 3.1 — Blog layout wraps all /blog/* public routes
// Note: homepage (/) uses the root layout directly, not this one.

import { ReactNode } from 'react';
// import { useTheme } from 'next-themes';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogFooter } from '@/components/blog/blog-footer';

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({ children }: BlogLayoutProps) {
  // const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen relative w-full flex-col bg-white dark:bg-slate-950">
      {/* {
        theme === 'light' && (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #c9e8e9 100%)",
            }}
          />
        )
      } */}

      {/* <div
        className="absolute inset-0 z-0 bg-[radial-gradient(125% 125% at 50% 90%, #fff 40%, #c9e8e9 100%)] dark:bg-transparent"
      /> */}

      <div
        className="fixed inset-0 z-0 bg-[radial-gradient(125%_125%_at_50%_90%,#fff_40%,#c9e8e9_100%)] dark:bg-transparent dark:relative dark:hidden"
      />

      <BlogHeader />
      <main className="flex-1 z-10">{children}</main>
      <BlogFooter className="z-10" />
    </div>
  );
}
