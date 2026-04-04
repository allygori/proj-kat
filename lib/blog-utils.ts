/**
 * Blog Utilities
 * Helper functions for blog functionality: reading time, slug generation, etc.
 * 
 * See AGENTS.md § 3.4 for blog post requirements.
 */

/**
 * Calculate reading time based on word count.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Convert title to URL-friendly slug.
 * Example: "Complete Guide to Teeth Whitening" -> "complete-guide-to-teeth-whitening"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove multiple hyphens
}

/**
 * Extract table of contents from HTML content.
 * Finds all h2 and h3 headings, generates IDs if missing.
 */
export function extractTableOfContents(html: string) {
  const headingRegex = /<h([23]) id="([^"]+)">([^<]+)<\/h\1>/g;
  const headings: Array<{ id: string; title: string; level: 'h2' | 'h3' }> =
    [];

  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      id: match[2],
      title: match[3],
      level: (match[1] === '2' ? 'h2' : 'h3') as 'h2' | 'h3',
    });
  }

  return headings;
}

/**
 * Find related posts based on category and tag similarity.
 */
export function findRelatedPosts<T extends { category: string; tags: string[]; slug: string }>(
  currentPost: T,
  allPosts: T[],
  limit: number = 3
): T[] {
  return allPosts
    .filter(
      (post) =>
        post.slug !== currentPost.slug && // Exclude current post
        (post.category === currentPost.category || // Same category or
          currentPost.tags.some((tag) => post.tags.includes(tag))) // Matching tags
    )
    .sort((a, b) => {
      // Score by relevance: category match + tag matches
      const scoreA =
        (a.category === currentPost.category ? 2 : 0) +
        a.tags.filter((tag) => currentPost.tags.includes(tag)).length;

      const scoreB =
        (b.category === currentPost.category ? 2 : 0) +
        b.tags.filter((tag) => currentPost.tags.includes(tag)).length;

      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Format date for display.
 * Example: new Date('2024-03-15') -> "March 15, 2024"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Truncate text to specified length while preserving word boundaries.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
