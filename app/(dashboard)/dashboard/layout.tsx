import { cookies } from "next/headers"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ActiveThemeProvider } from "@/components/dashboard/active-theme"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { TooltipProvider } from "@/components/ui/tooltip";

// import "@/app/(dashboard)/dashboard/theme.css"
// import { ThemeProvider } from "next-themes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
      // <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

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

      // </ThemeProvider>
  )
}
