"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  GripVertical,
  Plus,
  Trash2,
  Heading1,
  Type,
  ImageIcon,
} from "lucide-react"

// --- TYPES & SCHEMA ---

type BlockType = "heading" | "rich-text" | "banner"

interface BlockData {
  id: string
  type: BlockType
  content: string
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string(),
  seo: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    keywords: z.string(),
  }),
  publishedAt: z.string(),
  authorId: z.string(),
  categoryId: z.string(),
  tags: z.string(),
  featuredImage: z.string(),
})

// type FormValues = z.infer<typeof formSchema>

// --- SUB-COMPONENTS ---

interface SortableBlockProps {
  block: BlockData
  onUpdate: (id: string, content: string) => void
  onRemove: (id: string) => void
}

function SortableBlock({ block, onUpdate, onRemove }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  let icon = <Type className="size-4 text-muted-foreground" />
  let label = "Rich Text"
  if (block.type === "heading") {
    icon = <Heading1 className="size-4 text-muted-foreground" />
    label = "Heading"
  } else if (block.type === "banner") {
    icon = <ImageIcon className="size-4 text-muted-foreground" />
    label = "Banner Image"
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab rounded-md p-1 hover:bg-muted active:cursor-grabbing"
          >
            <GripVertical className="size-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground">
            {icon}
            {label}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          onClick={() => onRemove(block.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="pl-8 pr-2">
        <FieldGroup>
          {block.type === "heading" && (
            <Field>
              <Input
                value={block.content}
                onChange={(e) => onUpdate(block.id, e.target.value)}
                placeholder="Heading text..."
                className="text-lg font-semibold"
              />
            </Field>
          )}
          {block.type === "rich-text" && (
            <Field>
              <Textarea
                value={block.content}
                onChange={(e) => onUpdate(block.id, e.target.value)}
                placeholder="Write some content..."
                className="min-h-[120px] resize-y"
              />
            </Field>
          )}
          {block.type === "banner" && (
            <Field>
              <Input
                value={block.content}
                onChange={(e) => onUpdate(block.id, e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </Field>
          )}
        </FieldGroup>
      </div>
    </div>
  )
}

// --- MAIN COMPONENT ---

export function CreatePostForm() {
  const [blocks, setBlocks] = React.useState<BlockData[]>([
    { id: "1", type: "heading", content: "" },
    { id: "2", type: "rich-text", content: "" },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addBlock = (type: BlockType) => {
    setBlocks([
      ...blocks,
      { id: Date.now().toString(), type, content: "" },
    ])
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks((items) =>
      items.map((b) => (b.id === id ? { ...b, content } : b))
    )
  }

  const removeBlock = (id: string) => {
    setBlocks((items) => items.filter((b) => b.id !== id))
  }

  const form = useForm({
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      },
      publishedAt: "",
      authorId: "",
      categoryId: "",
      tags: "",
      featuredImage: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // Merge form values and React blocks state
      const payload = { ...value, blocks }

      toast("Draft Saved Successfully", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-zinc-950 p-4 font-mono text-xs text-zinc-50 border border-zinc-800 dark:bg-zinc-900">
            <code>{JSON.stringify(payload, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
      })
    },
  })

  // Dummy data
  const authors = [
    { id: "a1", name: "John Doe" },
    { id: "a2", name: "Jane Smith" },
  ]
  const categories = [
    { id: "c1", name: "Technology" },
    { id: "c2", name: "Lifestyle" },
  ]

  return (
    <form
      id="create-post-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col items-start gap-6 lg:flex-row"
    >
      {/* LEFT COLUMN: MAIN CONTENT */}
      <div className="flex w-full flex-1 flex-col gap-6">
        <FieldGroup>
          <form.Field name="title">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="sr-only">
                    Post Title
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      // Auto-generate slug if it's empty
                      if (!form.getFieldValue("slug")) {
                        form.setFieldValue(
                          "slug",
                          e.target.value.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^\w-]+/g, "")
                        )
                      }
                    }}
                    aria-invalid={isInvalid}
                    placeholder="Post Title"
                    className="h-16 border-transparent bg-transparent px-0 text-3xl font-bold shadow-none hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 md:text-4xl"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="flex flex-col gap-6">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <FieldGroup>
                  <form.Field name="shortDescription">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Excerpt</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="A brief summary of the post..."
                          className="resize-y"
                          rows={3}
                        />
                        <FieldDescription>
                          Used for blog previews and summaries.
                        </FieldDescription>
                      </Field>
                    )}
                  </form.Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={blocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-4">
                    {blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        onUpdate={updateBlock}
                        onRemove={removeBlock}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex justify-center rounded-xl border-2 border-dashed border-border py-4 bg-card/50">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline">
                        <Plus data-icon="inline-start" />
                        Add Block
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem onClick={() => addBlock("heading")}>
                      <Heading1 data-icon="inline-start" />
                      Heading
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("rich-text")}>
                      <Type data-icon="inline-start" />
                      Rich Text
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("banner")}>
                      <ImageIcon data-icon="inline-start" />
                      Banner Image
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="flex flex-col gap-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Search Engine Optimization</CardTitle>
                <CardDescription>
                  Configure how this post will appear in search results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup className="flex flex-col gap-6">
                  <form.Field name="seo.metaTitle">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Meta Title</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="SEO Title (leave empty to use post title)"
                        />
                      </Field>
                    )}
                  </form.Field>
                  <form.Field name="seo.metaDescription">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Meta Description</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="A concise description for search engines..."
                          rows={3}
                        />
                      </Field>
                    )}
                  </form.Field>
                  <form.Field name="seo.keywords">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Keywords</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="react, cms, nextjs"
                        />
                      </Field>
                    )}
                  </form.Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT COLUMN: SIDEBAR */}
      <div className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:w-80">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Publish Options</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="flex flex-col gap-4">
              <form.Field name="slug">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>URL Slug</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <InputGroupText>/post/</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      </InputGroup>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="publishedAt">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Publish Date</FieldLabel>
                    <Input
                      type="datetime-local"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col gap-2 rounded-b-xl bg-muted/10 p-6 pt-0">
            <Field orientation="horizontal" className="w-full">
              <Button type="button" variant="outline" className="w-full" onClick={() => form.handleSubmit()}>
                Save Draft
              </Button>
              <Button type="submit" form="create-post-form" className="w-full">
                Publish
              </Button>
            </Field>
            <Button type="button" variant="ghost" className="w-full text-muted-foreground">
              Preview
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Taxonomies</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="flex flex-col gap-4">
              <form.Field name="authorId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Author</FieldLabel>
                    <Select
                      defaultValue={field.state.value}
                      onValueChange={(val) => field.handleChange(val || "")}
                    >
                      <SelectTrigger className="w-full" size="default">
                        <SelectValue placeholder="Select an author" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map((author) => (
                          <SelectItem key={author.id} value={author.id}>
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="categoryId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Select
                      defaultValue={field.state.value}
                      onValueChange={(val) => field.handleChange(val || "")}
                    >
                      <SelectTrigger className="w-full" size="default">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="tags">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="tag1, tag2, tag3"
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>Comma separated (max 3)</FieldDescription>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Featured Image</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form.Field name="featuredImage">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="https://.../image.webp"
                        type="url"
                        aria-invalid={isInvalid}
                      />
                      {field.state.value && (
                        <div className="mt-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={field.state.value}
                            alt="Featured"
                            className="size-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
