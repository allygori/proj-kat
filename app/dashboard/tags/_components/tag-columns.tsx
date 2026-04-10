"use client"

import { ColumnDef } from "@tanstack/react-table"
import { GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { CategoryType } from "@/components/blog/types"
import { CollectionRowActions } from "@/components/dashboard/collection/row-actions"

// Drag handle component for sortable columns
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

export const getCategoryColumns = (isSortable: boolean = false): ColumnDef<CategoryType>[] => {
  const baseColumns: ColumnDef<CategoryType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              (table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() &&
                  "indeterminate")) as unknown as boolean
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Tag Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.original.name}</span>
          {row.original.description && (
            <span className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</span>
          )}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "slug",
      header: "URL Slug",
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-1 rounded">{row.original.slug}</code>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date Created",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <CollectionRowActions
          row={row}
          label="Tag"
          endpoint="/api/tags"
          editUrl="/dashboard/tags"
        />
      ),
    },
  ]

  if (isSortable) {
    return [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original._id} />,
      },
      ...baseColumns,
    ]
  }

  return baseColumns
}
