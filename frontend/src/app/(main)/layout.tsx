import AppSidebar from "@/components/custom/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppTopbar from "@/components/custom/app-topbar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppTopbar />
                <div className="pt-16">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}