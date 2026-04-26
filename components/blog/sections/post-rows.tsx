import type { BlogPostType } from '@/components/blog/types';
import { PostIndexRow } from "../post-index-row";
import Link from 'next/link';

const SPECIALTY_FILTERS = [
  { label: 'Semua', value: '' },
  { label: 'Ortodonti', value: 'ortodonti' },
  { label: 'Bedah Mulut', value: 'bedah-mulut' },
  { label: 'Konservasi', value: 'konservasi' },
  { label: 'Prostodonsia', value: 'prostodonsia' },
  { label: 'Periodonsia', value: 'periodonsia' },
  { label: 'Pedodontik', value: 'pedodontik' },
  { label: 'Radiologi', value: 'radiologi' },
  { label: 'Umum', value: 'umum' },
];


type PostRowsProps = {
  initialPosts?: BlogPostType[];
  activeTag?: string;
  className?: string;
};

const PostRows = ({ initialPosts = [], activeTag = '', className = "" }: PostRowsProps) => {
  return (
    <section aria-labelledby="all-posts-heading" className={className}>
      <div className="mb-4 flex items-center gap-3">
        <h2
          id="all-posts-heading"
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Semua Tulisan
        </h2>
      </div>

      {/* Specialty filter pills */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter kategori">
        {SPECIALTY_FILTERS.map((f) => {
          const isActive = activeTag === f.value;
          return (
            <Link
              key={f.value}
              href={f.value ? `/?tag=${f.value}` : '/'}
              scroll={false}
              className={[
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
                isActive
                  ? 'bg-[#155E88] text-white shadow-sm'
                  : 'bg-[#E8F4F8] text-[#155E88] hover:bg-[#a9dbdc]/30 dark:bg-slate-800 dark:text-[#a9dbdc] dark:hover:bg-slate-700',
              ].join(' ')}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Column headers — desktop only */}
      <div className="mb-1 hidden items-center gap-4 border-b-2 border-[#155E88]/10 pb-2 sm:flex sm:gap-5">
        <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Tanggal
        </span>
        <span className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
        <span className="hidden w-32 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400 md:block">
          Kategori
        </span>
        <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Judul
        </span>
      </div>

      {initialPosts.length > 0 ? (
        <div>
          {initialPosts.map((post) => (
            <PostIndexRow key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-slate-400">
          Tidak ada tulisan dengan filter ini.
        </p>
      )}
    </section>
  )
}

export default PostRows