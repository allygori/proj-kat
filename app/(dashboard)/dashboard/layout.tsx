import { cookies } from "next/headers"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ActiveThemeProvider } from "@/app/(dashboard)/_components/active-theme"
import { AppSidebar } from "@/app/(dashboard)/_components/app-sidebar"
import { SiteHeader } from "@/app/(dashboard)/_components/site-header"
import { TooltipProvider } from "@/components/ui/tooltip";

// import "@/app/(dashboard)/dashboard/theme.css"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
    <ActiveThemeProvider>
      <TooltipProvider>
        <SidebarProvider
          defaultOpen={defaultOpen}
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </ActiveThemeProvider>
  )
}
