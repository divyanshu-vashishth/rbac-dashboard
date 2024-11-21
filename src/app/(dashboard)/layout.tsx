import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen flex-1 w-full">
        <SidebarTrigger />
        <div className="px-6 py-6 w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
