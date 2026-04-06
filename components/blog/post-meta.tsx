// Reference: AGENTS.md § 3.4 — Post metadata display component

import { formatDate } from '@/lib/format';
import { Clock, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type PostMetaProps = {
  authorName?: string;
  publishedAt?: string | Date | null;
  readingTime?: number;
  className?: string;
  layout?: 'row' | 'compact';
};

export function PostMeta({
  authorName,
  publishedAt,
  readingTime,
  className,
  layout = 'row',
}: PostMetaProps) {
  const dateStr = publishedAt ? formatDate(publishedAt as string) : null;

  if (layout === 'compact') {
    return (
      <p className={cn('text-xs text-slate-500 dark:text-slate-400', className)}>
        {authorName && <span>{authorName}</span>}
        {authorName && dateStr && <span className="mx-1.5">·</span>}
        {dateStr && <time>{dateStr}</time>}
        {readingTime && (
          <>
            <span className="mx-1.5">·</span>
            <span>{readingTime} menit baca</span>
          </>
        )}
      </p>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400',
        className
      )}
    >
      {authorName && (
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span>{authorName}</span>
        </span>
      )}
      {dateStr && (
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <time>{dateStr}</time>
        </span>
      )}
      {readingTime && (
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{readingTime} menit baca</span>
        </span>
      )}
    </div>
  );
}
