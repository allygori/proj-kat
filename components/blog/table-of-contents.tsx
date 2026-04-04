'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Table of Contents Component
 * Auto-generates from h2/h3 headings in post content.
 * Highlights current section during scroll.
 * 
 * See AGENTS.md § 3.4 for blog post features.
 */

type TableOfContentsItem = {
  id: string;
  title: string;
  level: 'h2' | 'h3';
};

type TableOfContentsProps = {
  items: TableOfContentsItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Create intersection observer for scroll highlighting
    const observers = items.map((item) => {
      const element = document.getElementById(item.id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(item.id);
            }
          });
        },
        { rootMargin: '-100px 0% -66%' }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => {
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] space-y-1 overflow-y-auto">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-500">
        On this page
      </p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className={`inline-block rounded px-2 py-1 text-sm transition-colors ${
                activeId === item.id
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              } ${item.level === 'h3' ? 'ml-3' : ''}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
