'use client';

import { useState } from 'react';
import { Twitter, Linkedin, Copy, Check } from 'lucide-react';

/**
 * Share Buttons Component
 * Provides sharing options: Twitter, LinkedIn, and copy-to-clipboard.
 * 
 * See AGENTS.md § 3.4 for blog post features.
 */

type ShareButtonsProps = {
  title: string;
  url: string;
};

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch {
      console.error('Failed to copy link');
    }
  };

  const shareLinks = [
    {
      icon: Twitter,
      label: 'Share on Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'hover:text-blue-400',
    },
    {
      icon: Linkedin,
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:text-blue-600',
    },
  ];

  return (
    <div className="flex items-center gap-3 border-t border-b border-slate-200 py-4 dark:border-slate-800">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Share:
      </span>
      <div className="flex items-center gap-3">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={`rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 ${link.color} dark:text-slate-400 dark:hover:bg-slate-800`}
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}

        {/* Copy link button */}
        <button
          onClick={handleCopyLink}
          aria-label="Copy link"
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {copiedToClipboard ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
