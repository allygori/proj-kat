import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';

interface PostHeroProps {
  category: string;
  title: string;
  date: string;
  readingTime: string;
  image: string;
}

export function PostHero({
  category,
  title,
  date,
  readingTime,
  image,
}: PostHeroProps) {
  return (
    <header className="relative w-full h-[614px] md:h-[768px] flex items-end pb-12 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#f8f9fd] via-[#f8f9fd]/40 to-transparent dark:from-slate-900 dark:via-slate-900/40" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
        <div className="inline-block bg-[#9ecfd1] text-[#002021] px-4 py-1 rounded-full text-sm font-medium mb-6">
          {category}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#191c1f] dark:text-white tracking-tight leading-tight mb-6">
          {title}
        </h1>
        <div className="flex items-center gap-4 text-[#717880] dark:text-slate-400 font-medium text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readingTime}
          </span>
        </div>
      </div>
    </header>
  );
}
