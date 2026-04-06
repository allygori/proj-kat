// Reference: AGENTS.md § 3.4 — Category hero section for /blog/category/[slug]

import { SpecialtyBadge } from './specialty-badge';

type CategoryHeroProps = {
  category: {
    name: string;
    slug: string;
    description?: string;
  };
  postCount?: number;
};

// Map slugs to a short description fallback
const descriptionMap: Record<string, string> = {
  'studi-kasus': 'Dokumentasi kasus klinis nyata dari praktik sehari-hari.',
  'ulasan-produk': 'Review jujur alat, bahan, dan produk yang digunakan dalam klinik.',
  opini: 'Pandangan dan pendapat tentang isu-isu terkini di dunia kedokteran gigi.',
  ortodonti: 'Artikel seputar perawatan ortodontik dan maloklusi gigi.',
  'bedah-mulut': 'Kasus dan teknik bedah mulut & maksilofasial.',
  konservasi: 'Konservasi gigi, endodontik, dan perawatan saluran akar.',
  prostodonsia: 'Gigi tiruan, implan, dan rehabilitasi oral.',
  periodonsia: 'Kesehatan jaringan periodontal dan perawatan gusi.',
  pedodontik: 'Kedokteran gigi anak — dari pencegahan sampai perawatan.',
  radiologi: 'Radiologi kedokteran gigi dan interpretasi gambaran.',
};

export function CategoryHero({ category, postCount }: CategoryHeroProps) {
  const description =
    category.description ||
    descriptionMap[category.slug] ||
    `Kumpulan artikel tentang ${category.name}.`;

  return (
    <div className="border-b border-[#E2EDF2] pb-8 pt-10 dark:border-slate-800">
      <div className="flex items-start gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#155E88]/60">
            Kategori
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
              style={{ letterSpacing: '-0.02em' }}
            >
              {category.name}
            </h1>
            <SpecialtyBadge specialty={category.slug} size="md" />
          </div>
          <p className="mt-3 max-w-xl text-base text-slate-500 dark:text-slate-400">
            {description}
          </p>
          {typeof postCount === 'number' && (
            <p className="mt-2 text-xs text-slate-400">
              {postCount} {postCount === 1 ? 'tulisan' : 'tulisan'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
