import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { BlogPostType, MediaType, UserType } from "@/components/blog/types"
import { Badge } from "@/components/ui/badge"




export const ItemDetailDrawer = ({ item }: { item: BlogPostType }) => {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground font-semibold underline-offset-4 hover:underline">
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className={isMobile ? "" : "sm:max-w-md"}>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="leading-tight text-xl">{item.title}</DrawerTitle>
          <DrawerDescription>
            Article Preview & Details
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm scrollbar-hide py-4">
          {item.featured_image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-sm">
              <Image
                src={(item.featured_image as unknown as MediaType)?.url || ""}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="grid gap-6 mt-2">
            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">Summary Excerpt</h4>
              <p className="leading-relaxed text-balance italic">
                &ldquo;{item.excerpt || "No excerpt has been provided for this article."}&rdquo;
              </p>
            </section>

            <div className="grid grid-cols-2 gap-6 bg-muted/30 p-3 rounded-lg border border-dashed">
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">Status</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={item.published_status === 'published' ? 'default' : 'outline'} className="capitalize">
                    {item.published_status}
                  </Badge>
                </div>
              </section>
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">Read Time</h4>
                <p className="font-medium">{item.reading_time || 0} minutes</p>
              </section>
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">Author</h4>
                <p className="font-medium">{(item.author as unknown as UserType)?.name || "Unknown"}</p>
              </section>
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">ID</h4>
                <p className="font-mono text-[10px]">{item.nid}</p>
              </section>
            </div>

            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">Permanent URL Slug</h4>
              <p className="text-xs font-mono bg-background p-2 border rounded select-all">/blog/{item.slug}</p>
            </section>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t">
              <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
              {item.updated_at && <span>Modified: {new Date(item.updated_at).toLocaleDateString()}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-6">
            <Button className="w-full" onClick={() => window.location.href = `/dashboard/posts/${item._id}/edit`}>
              Open in Full Editor
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.open(`/blog/${item.slug}`, '_blank')}>
              Preview Public Page
            </Button>
          </div>
        </div>
        <DrawerFooter className="border-t">
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full">Done Reviewing</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}