"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BlogPostType } from "@/components/blog/types"
import { DataTableBasic } from "./data-table-basic"
import { DataTableSortable } from "./data-table-sortable"
import { getCategoryColumns } from "./category-columns"

interface CategoryTableWrapperProps {
  isSortable?: boolean
}

export function CategoryTableWrapper({ isSortable = false }: CategoryTableWrapperProps) {
  const [data, setData] = React.useState<BlogPostType[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch data')
      const json = await res.json()
      setData(json.data || [])
    } catch (err) {
      console.error(err);
      toast.error('Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPosts()
  }, [])

  const columns = React.useMemo(() => getCategoryColumns(isSortable), [isSortable])

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="w-full flex-col justify-start gap-6 space-y-4">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">Articles</h1>
              <Badge variant="secondary">{data.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.href = '/dashboard/posts/create'}
              >
                <Plus className="size-4 mr-2" />
                <span className="hidden lg:inline">Create Post</span>
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            {isSortable ? (
              <DataTableSortable
                columns={columns}
                data={data}
                setData={setData}
                searchKey="title"
                isLoading={isLoading}
              />
            ) : (
              <DataTableBasic
                columns={columns}
                data={data}
                searchKey="title"
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
