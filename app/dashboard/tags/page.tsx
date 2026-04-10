"use client"

import * as React from "react"
import { CollectionShell } from "@/components/dashboard/collection/shell"
import { getCategoryColumns } from "./_components/tag-columns"

export default function CategoryIndexPage() {
  const columns = React.useMemo(() => getCategoryColumns(true), []) as any

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
