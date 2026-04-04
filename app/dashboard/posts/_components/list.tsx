"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  MoreVertical,
  Loader2,
  Plus,
  Pen,
  Trash
} from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import Link from "next/link"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

type Post = {
  _id: string
  title: string
  slug: string
  published_status: string
  createdAt: string
  author?: { name?: string }
}

export function PostList() {
  const [data, setData] = React.useState<Post[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/posts')
      if (!res.ok) throw new Error('Failed to fetch data')
      const json = await res.json()
      setData(json.posts || [])
    } catch (err) {
      toast.error('Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPosts()
  }, [])

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (err) {
      toast.error('Failed to delete post');
    }
  }

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: "author.name",
      header: "Author",
      cell: ({ row }) => row.original.author?.name || 'Unknown',
    },
    {
      accessorKey: "published_status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.published_status === 'published' ? 'default' : 'outline'} className="capitalize">
          {row.original.published_status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="size-4" />
            </Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={
              <Link href={`/dashboard/posts/${row.original._id}/edit`}>
                <Pen className="mr-2 size-4" /> Edit
              </Link>
            } />
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => deletePost(row.original._id)}>
              <Trash className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full flex-col justify-start gap-6 space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter posts..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/posts/create"
            className={buttonVariants({
              variant: "default",
              size: "sm"
            })}
          >
            <Plus className="mr-2 size-4" />
            Create Post
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
