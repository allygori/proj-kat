"use client"

import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { BlogPostType, MediaType, UserType, CategoryType, TagType } from "@/components/blog/types"
import { Calendar, Tag, User, MapPin, ExternalLink, Edit2, FileText, Image as ImageIcon } from "lucide-react"
import { useState } from "react"

interface ViewDrawerProps<T = any> {
  item: T
  children: React.ReactNode
  editUrl?: string
  viewUrl?: string
}

const snapPoints = ['148px', '355px', 1];


export function ViewDrawer<T extends Record<string, any>>({ item, children, editUrl, viewUrl }: ViewDrawerProps<T>) {
  const isMobile = useIsMobile()
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);


  // Detection logic
  const isPost = 'title' in item && 'content' in item;
  const isMedia = 'filename' in item && 'url' in item;
  const isCategory = 'name' in item && 'slug' in item && 'parent' in item;
  const isTag = 'name' in item && 'slug' in item && !('parent' in item);

  const title = item.title || item.name || item.filename || "Item Details";
  const description = isPost ? "Article Preview & Details" : isMedia ? "Media Asset Details" : isCategory ? "Category Information" : isTag ? "Tag Configuration" : "General Information";

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      {...(isMobile ? { snapPoints, activeSnapPoint: snap, setActiveSnapPoint: setSnap, fadeFromIndex: 1 } as never : {})}
    >
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className={isMobile ? "p-0" : "sm:max-w-md ml-auto p-0"}>
        <div className="flex flex-1 flex-col min-w-0 max-w-full overflow-hidden">
          <DrawerHeader className="gap-1 border-b pb-4 shrink-0 min-w-0">
            <div className="flex items-center gap-2 mb-1 min-w-0 overflow-hidden">
              {isPost && <FileText className="size-4 text-blue-500 shrink-0" />}
              {isMedia && <ImageIcon className="size-4 text-purple-500 shrink-0" />}
              {(isCategory || isTag) && <Tag className="size-4 text-emerald-500 shrink-0" />}
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter h-5 shrink-0 truncate">
                {isPost ? "Post" : isMedia ? "Media" : isCategory ? "Category" : isTag ? "Tag" : "Item"}
              </Badge>
            </div>
            <DrawerTitle className="leading-tight text-xl font-bold break-words">{title}</DrawerTitle>
            <DrawerDescription className="text-sm break-words">
              {description}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 p-4 space-y-6 scrollbar-hide ">
            {/* Visual Preview for Post or Media */}
            {(isPost || isMedia) && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted shadow-sm group">
                <Image
                  src={isMedia ? item.url : (item.featured_image as unknown as MediaType)?.url || ""}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!isMedia && !item.featured_image && (
                  <div className="flex h-full items-center justify-center text-muted-foreground italic text-xs">
                    No preview image available
                  </div>
                )}
              </div>
            )}

            {/* Core Details Grid */}
            <div className="grid gap-6">
              {/* Excerpt/Description Section */}
              {(item.excerpt || item.description) && (
                <section className="bg-muted/30 p-4 rounded-xl border border-dashed border-muted-foreground/20 min-w-0">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 flex items-center gap-1.5">
                    <FileText className="size-3" />
                    Summary / Description
                  </h4>
                  <p className="leading-relaxed text-sm text-foreground/80 italic break-words">
                    &ldquo;{item.excerpt || item.description}&rdquo;
                  </p>
                </section>
              )}

              {/* Status & Metadata (Post specific) */}
              {isPost && (
                <div className="grid grid-cols-2 gap-4 min-w-0">
                  <DetailBox label="Status" icon={<CheckCircle isPublished={item.published_status === 'published'} />}>
                    <Badge variant={item.published_status === 'published' ? 'default' : 'outline'} className="capitalize text-[10px]">
                      {item.published_status}
                    </Badge>
                  </DetailBox>
                  <DetailBox label="Read Time" icon={<div className="size-1.5 rounded-full bg-blue-500" />}>
                    <span className="font-medium">{item.reading_time || 0} minutes</span>
                  </DetailBox>
                  <DetailBox label="Author" icon={<User className="size-3" />}>
                    <span className="truncate">{(item.author as unknown as UserType)?.name || "Unknown"}</span>
                  </DetailBox>
                  <DetailBox label="Nano ID" icon={<div className="size-1.5 rounded-full bg-muted-foreground" />}>
                    <span className="font-mono text-[10px] uppercase tracking-widest">{item.nid}</span>
                  </DetailBox>
                </div>
              )}

              {/* Media Specific Details */}
              {isMedia && (
                <div className="grid grid-cols-2 gap-4 min-w-0">
                  <DetailBox label="File Size" icon={<div className="size-1.5 rounded-full bg-amber-500" />}>
                    <span>{(item.size / 1024).toFixed(1)} KB</span>
                  </DetailBox>
                  <DetailBox label="Type" icon={<div className="size-1.5 rounded-full bg-blue-500" />}>
                    <span className="truncate">{item.mime_type}</span>
                  </DetailBox>
                </div>
              )}

              {/* Category Specific */}
              {isCategory && item.parent && (
                <DetailBox label="Parent Category" icon={<MapPin className="size-3" />}>
                  <Badge variant="secondary" className="text-[10px]">
                    {(item.parent as unknown as CategoryType)?.name || "N/A"}
                  </Badge>
                </DetailBox>
              )}

              {/* URLs Section */}
              {(item.slug || isMedia) && (
                <section className="min-w-0">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Permanent URL</h4>
                  <div className="flex flex-col gap-2 min-w-0">
                    <div className="relative group min-w-0">
                      <p className="text-[11px] font-mono bg-muted/50 p-3 rounded-lg border select-all truncate pr-16 leading-none">
                        {isMedia ? item.url : `/blog/${item.slug}`}
                      </p>
                      <button
                        onClick={() => {
                          const url = isMedia ? item.url : `${window.location.origin}/blog/${item.slug}`;
                          if (!isMobile) {
                            navigator.clipboard.writeText(url);
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold bg-background border px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Timestamps */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 pt-4 border-t min-w-0 flex-wrap gap-2">
                <span className="flex items-center gap-1"><Calendar className="size-3" /> Added {new Date(item.created_at).toLocaleDateString()}</span>
                {item.updated_at && <span>Updated {new Date(item.updated_at).toLocaleDateString()}</span>}
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t bg-muted/10 shrink-0">
            <div className="flex flex-col gap-2 w-full">
              {editUrl && (
                <Button
                  className="w-full h-11 rounded-xl shadow-sm"
                  onClick={() => window.location.href = `${editUrl}/${item._id}/edit`}
                >
                  <Edit2 className="size-4 mr-2" />
                  Edit {isPost ? "Content" : isMedia ? "Asset" : "Details"}
                </Button>
              )}
              {viewUrl && item.slug && (
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl"
                  onClick={() => window.open(`${viewUrl}/${item.slug}`, '_blank')}
                >
                  <ExternalLink className="size-4 mr-2" />
                  View Live Site
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="secondary" className="w-full h-11 rounded-xl">Close Preview</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function DetailBox({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-xl border bg-background shadow-[0_1px_2px_rgba(0,0,0,0.05)] min-w-0">
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-1 min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </span>
      <div className="text-sm font-semibold truncate leading-none py-0.5 min-w-0">
        {children}
      </div>
    </div>
  )
}

function CheckCircle({ isPublished }: { isPublished: boolean }) {
  return (
    <div className={`size-1.5 rounded-full ${isPublished ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
  )
}
