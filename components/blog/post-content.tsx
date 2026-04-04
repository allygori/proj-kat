'use client';

/**
 * Post Content Component
 * Renders blog post body with styled typography and media.
 * Supports markdown-like HTML structure.
 * 
 * See AGENTS.md § 3.4 for blog post content specifications.
 */

type PostContentProps = {
  content: string;
  className?: string;
};

export function PostContent({
  content,
  className = '',
}: PostContentProps) {
  return (
    <article
      className={`prose prose-slate max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
