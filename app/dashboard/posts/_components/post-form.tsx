"use client"

// import { useState } from "react"
// import { BlockData, SortableBlockProps } from "@/components/content-block/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "@tanstack/react-form"
// import { CalendarIcon, ChevronDownIcon, Clock2Icon, Plus } from "lucide-react"
import { toast } from "sonner"
import z from "zod"
import TabItemContent from "./tabs/content"
import TabItemMetadata from "./tabs/metadata"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { InputDateTime } from "@/components/ui/input-date-time"

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string(),
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




const PostForm = () => {
  // const [openCalendar, setOpenCalendar] = useState(false)
  // const [blocks, setBlocks] = useState<BlockData[]>([
  //   { id: "1", type: "heading", content: {} },
  //   { id: "2", type: "rich-text", content: {} },
  // ])

  const form = useForm({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
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
      const payload = { ...value }
      // const payload = { ...value, blocks }

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




  // const items: SortableBlockProps[] = [
  //   // { id: 1, value: '1', label: 'Standard 3-5 Days', description: 'Friday, 15 June - Tuesday, 19 June', price: 'Free' },
  //   // { id: 2, value: '2', label: 'Express', description: 'Friday, 15 June - Sunday, 17 June', price: '$5.00' },
  //   // { id: 3, value: '3', label: 'Overnight', description: 'Tomorrow', price: '$10.00' }

  //   {
  //     id: '1',
  //     block: {
  //       id: '1',
  //       type: "heading",
  //       content: {
  //         title: "Test 1",
  //       }
  //     }
  //   },
  //   {
  //     id: '2',
  //     block: {
  //       id: '2',
  //       type: "heading",
  //       content: {
  //         title: "Test 2",
  //       }
  //     }
  //   },
  //   {
  //     id: '3',
  //     block: {
  //       id: '3',
  //       type: "heading",
  //       content: {
  //         title: "Test 3",
  //       }
  //     }
  //   },
  //   {
  //     id: '4',
  //     block: {
  //       id: '4',
  //       type: "heading",
  //       content: {
  //         title: "Test 4",
  //       }
  //     }
  //   }
  // ]

  return (
    <form
      id="post-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col items-start gap-6 lg:flex-row"
    >
      {/* LEFT COLUMN: MAIN CONTENT */}
      <div className="flex w-full flex-1 flex-col gap-6">
        {/* Title */}
        <FieldGroup>
          <form.Field name="title">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Title
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
                    // placeholder="Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit"
                    className="h-10 text-xl font-normal shadow-none focus-visible:bg-transparent focus-visible:ring-0 md:text-lg"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        {/* Excerpt */}
        <FieldGroup>
          <form.Field name="excerpt">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Excerpt</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  // placeholder="A brief summary of the post..."
                  className="resize-y min-h-24"
                  rows={5}
                />
                <FieldDescription>
                  Used for blog previews and summaries.
                </FieldDescription>
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        {/* TABS: Content, Metadata, SEO */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList variant="line" className="mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="flex flex-col gap-6">
            {/* <Card className="border-border/50 shadow-sm"> */}
            {/* <CardContent className="p-6"> */}

            {/* </CardContent> */}
            {/* </Card> */}

            <TabItemContent />
          </TabsContent>

          <TabsContent value="metadata" className="flex flex-col gap-6">
            <TabItemMetadata />
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
                {/* <Input
                      type="datetime-local"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    /> */}

                {/* <InputGroup>
                      <InputGroupInput
                        id="time-from"
                        type="time"
                        step="1"
                        defaultValue="10:30:00"
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                      <InputGroupAddon>
                        <Clock2Icon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup> */}

                {/* <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                      <PopoverTrigger render={<Button variant='outline' id='date' className='w-full justify-between font-normal' />}>
                          <span className='flex items-center'>
                            <CalendarIcon className='mr-2' />
                            {field.state.value ? new Date(field.state.value).toLocaleDateString() : 'Pick a date'}
                          </span>
                          <ChevronDownIcon />
                      </PopoverTrigger>
                      <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={new Date(field.state.value)}
                          onSelect={date => {
                            // setDate(date)
                            setOpenCalendar(false)
                          }}
                        />

                                            <InputGroup>
                      <InputGroupInput
                        id="time-from"
                        type="time"
                        step="1"
                        defaultValue="10:30:00"
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                      <InputGroupAddon>
                        <Clock2Icon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                      </PopoverContent>
                    </Popover> */}

                <InputDateTime
                  type="datetime-local"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  defaultValue={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    console.log('e', e.target.value)
                    field.handleChange(e.target.value)
                  }}
                />
              </Field>
            )}
          </form.Field>
        </FieldGroup>
      </div>
    </form>
  )


  // return (
  //   <div>
  //     <ContentBlock blocks={items} />
  //   </div>
  // )
}

export default PostForm