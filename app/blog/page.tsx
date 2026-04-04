import { BlogIndexClient } from '@/components/blog/blog-index';
import { categories, mockPosts } from '@/lib/mock-posts';

export const metadata = {
  title: 'Katalis Dental Blog — Evidence-Based Dentistry',
  description:
    'Clinical insights, case studies, and product reviews for modern dental professionals.',
};

export default function BlogPage() {
  return <BlogIndexClient posts={mockPosts} categories={categories} />;
}
