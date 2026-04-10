"use client"

import * as React from "react"
import { CollectionShell } from "@/components/dashboard/collection/shell"
import { CategoryType } from "@/components/blog/types"
import { ColumnDef } from "@tanstack/react-table"
import { getCategoryColumns } from "./_components/category-columns"

export default function CategoryIndexPage() {
  const columns = React.useMemo(() => getCategoryColumns(true), []) as ColumnDef<CategoryType>[]

  return (
    <CollectionShell
      title="Categories"
      endpoint="/api/categories"
      columns={columns}
      searchFields={["name", "slug", "description"]}
      primarySearchField="name"
      createUrl="/dashboard/categories/create"
      createText="Add Category"
      isSortable={false}
    />
  )
}
