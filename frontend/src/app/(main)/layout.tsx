export const dynamic = 'force-dynamic';

import AppSidebar from "@/components/custom/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppTopbar from "@/components/custom/app-topbar";
import { auth } from "@clerk/nextjs/server";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { orgId } = await auth();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppTopbar />
                <div className="pt-16">
                    {orgId ? children : <div>Please select an organization</div>}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}