'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Blog Search & Filter Component
 * Provides unified search, category, and tag filtering.
 * Client-side search for MVP (can be upgraded to API later).
 * 
 * See AGENTS.md § 3.1 for blog feature specifications.
 */

type SearchFilterProps = {
  posts: Array<{
    slug: string;
    title: string;
    category: string;
    tags: string[];
  }>;
  onFiltered: (filtered: Array<{ slug: string; title: string; category: string; tags: string[] }>) => void;
  categories: string[];
};

export function SearchFilter({
  posts,
  onFiltered,
  categories,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Get all unique tags from posts
  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts]
  );

  // Filter posts based on search and selected filters
  useEffect(() => {
    let filtered = posts;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Tags filter (match selected tags)
    if (selectedTags.size > 0) {
      filtered = filtered.filter((post) =>
        Array.from(selectedTags).some((tag) => post.tags.includes(tag))
      );
    }

    onFiltered(filtered);
  }, [searchQuery, selectedCategory, selectedTags, posts, onFiltered]);

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.size > 0;

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
        />
      </div>

      {/* Categories filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tags filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedTags.has(tag)
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory(null);
            setSelectedTags(new Set());
          }}
          className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
          Clear all filters
        </button>
      )}
    </div>
  );
}
