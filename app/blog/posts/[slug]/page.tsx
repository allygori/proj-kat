import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/blog-post";
import { PostHero } from "./_components/post-hero";
import { PostContent } from "./_components/post-content";
import { AuthorBio } from "./_components/author-bio";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();

  const post = await BlogPost.findOne({ slug })
    .populate("featured_image")
    .populate("metadata.image")
    .lean();

  if (!post) {
    return { title: "Post Not Found" };
  }

  const title = post.metadata?.title || post.title;
  const description = post.metadata?.description || post.excerpt;
  const image = post.metadata?.image?.url || post.featured_image?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: "article",
      publishedTime: post.published_at?.toISOString() || post.created_at?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;

  await dbConnect();

  const post = await BlogPost.findOne({ slug })
    .populate("category")
    .populate("author")
    .populate("featured_image")
    .lean();

  if (!post) {
    notFound();
  }

  const categoryName = post.category?.name || "Uncategorized";
  const authorName = post.author?.name || "Author at Katalis";
  const authorBio = "Contributor at Katalis Dental."; // Static fallback if no bio field
  const authorImage = post.author?.image;

  const dateStr = post.published_at
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(post.published_at))
    : post.created_at
      ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(post.created_at))
      : "Unknown Date";

  const readingTime = post.reading_time ? `${post.reading_time} min read` : "5 min read";
  const image = post.featured_image?.url || "https://ezjgaiyziomyiyzd.public.blob.vercel-storage.com/placeholder.jpg";

  return (
    <main className="bg-[#f8f9fd] dark:bg-slate-900 transition-colors duration-300">
      <PostHero
        category={categoryName}
        title={post.title}
        date={dateStr}
        readingTime={readingTime}
        image={image}
      />

      <div className="max-w-4xl mx-auto pb-24">
        <PostContent htmlContent={post.content_html || ""} />
        <div className="px-6 max-w-3xl mx-auto">
          <AuthorBio
            name={authorName}
            bio={authorBio}
            image={authorImage}
          />
        </div>
      </div>
    </main>
  );
}
