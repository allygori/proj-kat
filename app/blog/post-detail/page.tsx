import { PostHero } from "./_components/post-hero";
import { PostContent } from "./_components/post-content";
import { AuthorBio } from "./_components/author-bio";
import { CommentsSection } from "./_components/comments-section";
import { RelatedArticles } from "./_components/related-articles";

export default function PostDetailPage() {
  // Dummy data based on code.html
  const postData = {
    category: "Wellness & Longevity",
    title: "Beyond The Surface: The Link Between Oral Health and Systemic Vitality",
    date: "Oct 24, 2024",
    readingTime: "8 min read",
    image: "https://ezjgaiyziomyiyzd.public.blob.vercel-storage.com/placeholder.jpg",
    author: {
      name: "Dr. Elena Vance",
      bio: "Chief Medical Editor at Katalis. Dr. Vance specializes in integrative dentistry, focusing on the biological intersection between oral pathogens and cardiovascular health.",
      image: undefined
      // image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkfhfHD1gxwLOG2d9mt7jrwKKrvKvfKL1Cm3LtOMqWwDWUtodLsTDITrhjTQwoWL36t43FWKHfvccFn53Jv6J3SiKLdF-Vq5Zl2rLIJ4_v79roC2F5mViFpXk2oFxD7P2z69LZ3bT0zFmk6mfjc80wa0i_Mye3xc0_tRcUCHbruNcb6ydL8Seqo0cSoY78mxpTXw7IBVgoXmHL4Znn2-82-jZFFEcxIsLIO-gB7RxbJ8ZJlOGm82yKgkwFxpsCDAa2m_Ylmac6F-o",
    }
  };

  return (
    <main className="bg-[#f8f9fd] dark:bg-slate-900 transition-colors duration-300">
      <PostHero
        category={postData.category}
        title={postData.title}
        date={postData.date}
        readingTime={postData.readingTime}
        image={postData.image}
      />

      <div className="max-w-4xl mx-auto pb-24">
        <PostContent />
        <div className="px-6 max-w-3xl mx-auto">
          <AuthorBio
            name={postData.author.name}
            bio={postData.author.bio}
            image={postData.author?.image}
          />
        </div>
        <CommentsSection />
      </div>

      {/* <RelatedArticles /> */}
    </main>
  );
}
