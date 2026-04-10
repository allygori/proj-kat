"use client"

import * as React from "react"
import { CollectionShell } from "@/components/dashboard/collection/shell"
import { ColumnDef } from "@tanstack/react-table"
import { TagType } from "@/components/blog/types"
import { getTagColumns } from "./_components/tag-columns"

export default function TagIndexPage() {
  const columns = React.useMemo(() => getTagColumns(true), []) as ColumnDef<TagType>[]

  return (
    <CollectionShell
      title="Tags"
      endpoint="/api/tags"
      columns={columns}
      searchFields={["name", "slug", "description"]}
      primarySearchField="name"
      createUrl="/dashboard/tags/create"
      createText="Add Tag"
      isSortable={false}
    />
  )
}