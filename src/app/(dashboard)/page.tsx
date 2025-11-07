import { AppSidebar } from "@/src/components/app-sidebar"
import { UsersTable } from "@/src/components/users-table"
import { SiteHeader } from "@/src/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/components/ui/sidebar"
import { getUsers } from "./actions"

export default async function Page() {
  const users = await getUsers()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <UsersTable data={users} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
