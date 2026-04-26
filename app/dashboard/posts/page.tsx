"use client"

import * as React from "react"
import { CollectionShell } from "@/components/dashboard/collection/shell"
import { ColumnDef } from "@tanstack/react-table"
import { BlogPostType } from "@/components/blog/types"
import { getPostColumns } from "./_components/post-columns"
import { FileText } from 'lucide-react';

export default function PostIndexPage() {
  const columns = React.useMemo(() => getPostColumns(false), []) as ColumnDef<BlogPostType>[]

  return (
    <>
      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em] animate-in slide-in-from-left-4 duration-500">
              <FileText className="h-4 w-4" />
              Blog Posts
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Articles
            </h1>
            <p className="text-slate-500 font-medium max-w-lg dark:text-slate-400">
              Manage title, excerpt, article body, author, category, tags, featured image and many.
            </p>
          </div>
        </div>
      </div>

      <CollectionShell
        title="Articles"
        endpoint="/api/posts?sort=-updated_at"
        columns={columns}
        searchFields={["title", "slug", "excerpt"]}
        primarySearchField="title"
        createUrl="/dashboard/posts/create"
        createText="Create Post"
        isSortable={false}
      />
    </>
  )
}
