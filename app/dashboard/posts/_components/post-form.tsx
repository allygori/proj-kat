"use client"

import { z } from "zod"
import { withForm } from "@/components/form/form.hook"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { InputGroup, InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import { MediaPickerModal } from "@/app/dashboard/media/_components/media-picker-modal"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"
import { INITIAL_BLOCK_VALUE } from "./post-form.constant"

// Ensure Zod handles the complex content object
const BlockContentSchema = z.object({
  content: z.string().optional(),
  content_html: z.string().optional(),
  content_blocks: z.any().optional(),
});

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  body: BlockContentSchema.optional(), // we will bind the TextEditor to this field
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
  publishedStatus: z.string().optional(),
  publishedAt: z.string().optional(),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.any()).max(3, "Max 3 tags allowed").optional(),
  featuredImage: z.string().optional(),
});

type FormProps = {
  title?: string;
};




const PostForm = withForm({
  defaultValues: {
    title: "",
    slug: "",
    excerpt: "",
    body: {
      content: "",
      content_html: "",
      content_blocks: INITIAL_BLOCK_VALUE,
    },
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
    },
    publishedStatus: "published",
    publishedAt: undefined,
    authorId: "",
    categoryId: "",
    tags: [],
    featuredImage: "",
  } as z.input<typeof formSchema>,
  props: {
    title: undefined,
  } as FormProps,
  render: function Render({ form, title }) {
    return (
      <form
        id="post-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col items-start gap-6 lg:flex-row"
      >
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div className="flex w-full flex-1 flex-col gap-6">
          {/* Title */}
          <FieldGroup>
            <form.AppField
              name="title"
              children={(field) => {
                return (
                  <field.TextField
                    label="Title"
                    autoComplete="off"
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      // Auto-generate slug if it's empty
                      if (!form.getFieldValue("slug")) {
                        form.setFieldValue(
                          "slug",
                          e.target.value.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^\w-]+/g, "")
                        );
                      }
                    }}
                    className="h-10 text-xl font-normal shadow-none focus-visible:bg-transparent focus-visible:ring-0 md:text-lg"
                  />
                );
              }}
            />
          </FieldGroup>

          {/* Excerpt */}
          <FieldGroup>
            <form.AppField
              name="excerpt"
              children={(field) => (
                <field.TextareaField
                  label="Excerpt"
                  description="Used for blog previews and summaries."
                  className="resize-y min-h-24"
                  rows={5}
                />
              )}
            />
          </FieldGroup>

          {/* TABS: Content, Metadata, SEO */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList variant="line" className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex flex-col gap-6">
              <form.AppField
                name="body"
                children={(field) => (
                  <field.TextEditorField />
                )}
              />
            </TabsContent>

            <TabsContent value="metadata" className="flex flex-col gap-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Metadata Setup</CardTitle>
                  <CardDescription>
                    Configure classification and authorship.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup className="flex flex-col gap-6">
                    <form.AppField
                      name="categoryId"
                      children={(field) => (
                        <field.SelectField
                          label="Category"
                          remote={{
                            url: "/api/categories/search",
                            resultsKey: "data",
                            labelKey: "name",    // Field to use as label
                            valueKey: "_id",     // Field to use as value
                            searchParam: "q",    // Query param for searching
                            limit: 5
                          }}
                        />
                      )}
                    />

                    {/* Tags is essentially multiple SelectField, adjust to SelectField or input for now. */}
                    {/* Assuming multi-select if available, otherwise just text/tags */}
                    <form.AppField
                      name="tags"
                      children={(field) => (
                        // Using Textfield for now until proper Tags multi-select is available
                        <field.TextField label="Tags (Comma separated ids for now)" />
                      )}
                    />

                    <form.AppField
                      name="authorId"
                      children={(field) => (
                        <field.TextField label="Author ID" />
                      )}
                    />
                  </FieldGroup>
                </CardContent>
              </Card>
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
                    <form.AppField
                      name="seo.metaTitle"
                      children={(field) => (
                        <field.TextField label="Meta Title" placeholder="SEO Title (leave empty to use post title)" />
                      )}
                    />
                    <form.AppField
                      name="seo.metaDescription"
                      children={(field) => (
                        <field.TextareaField label="Meta Description" placeholder="A concise description for search engines..." rows={3} />
                      )}
                    />
                    <form.AppField
                      name="seo.keywords"
                      children={(field) => (
                        <field.TextField label="Keywords" placeholder="react, cms, nextjs" />
                      )}
                    />
                  </FieldGroup>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* <div className={"item bordered overflow-hidden"}>
            <pre className="text-sm text-wrap wrap-break-word whitespace-pre-wrap">
              <code>{JSON.stringify(form.store.state.values, null, 2)}</code>
            </pre>
          </div> */}
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:w-80">
          <FieldGroup className="flex flex-col gap-6">

            <form.AppField
              name="slug"
              children={(field) => {
                return (
                  <field.TextField
                    label="URL Slug"
                  // InputProps={{
                  //   // Assuming support for Shadcn input groups via a wrapper, otherwise TextField directly handles it
                  // }}
                  />
                );
              }}
            />

            <form.AppField
              name="publishedAt"
              children={(field) => (
                <field.DateTimeField label="Publish Date" />
              )}
            />

            {/* FEATURED IMAGE PICKER */}
            <form.AppField
              name="featuredImage"
              children={(field) => (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Featured Image</span>
                  {field.state.value ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-muted">
                      {/* Preview placeholder since we only store ID, in real case we would fetch the image URL or store url in field as well */}
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                        {field.state.value}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full"
                        onClick={() => field.handleChange("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <MediaPickerModal
                      onSelect={(asset) => field.handleChange(asset._id)}
                      trigger={
                        <Button type="button" variant="outline" className="w-full border-dashed h-24 text-muted-foreground flex flex-col gap-1 rounded-xl">
                          <ImagePlus className="h-5 w-5" />
                          <span className="text-xs">Browse Media</span>
                        </Button>
                      }
                    />
                  )}
                </div>
              )}
            />

            <form.AppForm>
              <form.SubmitButton text="Save" />
            </form.AppForm>

          </FieldGroup>
        </div>
      </form>
    );
  },
});

export default PostForm;