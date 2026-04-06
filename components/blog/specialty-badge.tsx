// Reference: AGENTS.md § 3.4 — Specialty badge for dental clinical categories

import { cn } from '@/lib/utils';

export type DentalSpecialty =
  | 'ortodonti'
  | 'bedah-mulut'
  | 'konservasi'
  | 'prostodonsia'
  | 'periodonsia'
  | 'pedodontik'
  | 'radiologi'
  | 'umum';

const specialtyConfig: Record<
  string,
  { label: string; light: string; dark: string }
> = {
  ortodonti: {
    label: 'Ortodonti',
    light: 'bg-[#E8F4F8] text-[#155E88] border border-[#a9dbdc]/60',
    dark: 'dark:bg-[#155E88]/20 dark:text-[#a9dbdc] dark:border-[#a9dbdc]/20',
  },
  'bedah-mulut': {
    label: 'Bedah Mulut',
    light: 'bg-rose-50 text-rose-700 border border-rose-200',
    dark: 'dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800/40',
  },
  konservasi: {
    label: 'Konservasi',
    light: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dark: 'dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40',
  },
  prostodonsia: {
    label: 'Prostodonsia',
    light: 'bg-amber-50 text-amber-700 border border-amber-200',
    dark: 'dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40',
  },
  periodonsia: {
    label: 'Periodonsia',
    light: 'bg-violet-50 text-violet-700 border border-violet-200',
    dark: 'dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/40',
  },
  pedodontik: {
    label: 'Pedodontik',
    light: 'bg-orange-50 text-orange-700 border border-orange-200',
    dark: 'dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/40',
  },
  radiologi: {
    label: 'Radiologi',
    light: 'bg-sky-50 text-sky-700 border border-sky-200',
    dark: 'dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800/40',
  },
  umum: {
    label: 'Umum',
    light: 'bg-slate-100 text-slate-600 border border-slate-200',
    dark: 'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  },
};

type SpecialtyBadgeProps = {
  /** Category slug or name — matched case-insensitively */
  specialty: string;
  className?: string;
  size?: 'sm' | 'md';
};

export function SpecialtyBadge({
  specialty,
  className,
  size = 'sm',
}: SpecialtyBadgeProps) {
  // Try to match the slug directly, or find by label match
  const key = specialty?.toLowerCase().replace(/\s+/g, '-') ?? 'umum';
  const config = specialtyConfig[key] ?? specialtyConfig['umum'];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium tracking-wide',
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        config.light,
        config.dark,
        className
      )}
    >
      {config.label}
    </span>
  );
}
