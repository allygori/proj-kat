"use client"

import * as React from "react"
import { CollectionShell } from "@/components/dashboard/collection/shell"
import { ColumnDef } from "@tanstack/react-table"
import { BlogPostType } from "@/components/blog/types"
import { getPostColumns } from "./_components/post-columns"

export default function PostIndexPage() {
  const columns = React.useMemo(() => getPostColumns(false), []) as ColumnDef<BlogPostType>[]

  return (
    <CollectionShell
      title="Articles"
      endpoint="/api/posts"
      columns={columns}
      searchFields={["title", "slug", "excerpt"]}
      primarySearchField="title"
      createUrl="/dashboard/posts/create"
      createText="Create Post"
      isSortable={false}
    />
  )
}
