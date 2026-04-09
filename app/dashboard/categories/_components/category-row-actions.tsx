"use client"

import { MoreVertical } from "lucide-react"
import { Row } from "@tanstack/react-table"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BlogPostType } from "@/components/blog/types"

interface CategoryRowActionsProps {
  row: Row<BlogPostType>
  onDelete?: (id: string) => void
}

export function CategoryRowActions({ row, onDelete }: CategoryRowActionsProps) {
  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artikel?')) return;
    try {
      if (onDelete) {
        onDelete(id)
      } else {
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        toast.success('Artikel deleted successfully');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete artikel');
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button
        variant="ghost"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      />}>

        <MoreVertical className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => window.location.href = `/dashboard/posts/${row.original._id}/edit`}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`/blog/posts/${row.original.slug}`, '_blank')}>
          View Live
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => deletePost(row.original._id)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
