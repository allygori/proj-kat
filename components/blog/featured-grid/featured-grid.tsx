import { BlogPostType } from '../types';
import { PostCardHeroPrimary } from './card-primary'
import { PostCardHeroSecondary } from './card-secondary';


type FeaturedGridProps = {
  primary: BlogPostType;
  secondaries: BlogPostType[];
}

const FeaturedGrid = ({ primary, secondaries }: FeaturedGridProps) => {
  return (
    <section className="mb-12 grid gap-6 lg:grid-cols-3 overflow-hidden" aria-label="Artikel unggulan">
      <PostCardHeroPrimary data={primary} className="lg:col-span-2" />

      <div className="flex flex-col gap-4">
        {
          (secondaries || []).map((item, idx) => {
            return (
              <PostCardHeroSecondary key={idx} post={item} className="pb-4 md:pb-2 border-b border-slate-200 dark:border-slate-700 last:pb-0 last:border-b-0" />
            )
          })
        }
      </div>
    </section>
  )
}

export default FeaturedGrid