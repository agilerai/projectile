"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { FolderIcon, HomeIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher } from "@clerk/nextjs";

const sidebarItems = [
    {
        label: "Home",
        icon: HomeIcon,
        href: "/",
    },
    {
        label: "Projects",
        icon: FolderIcon,
        href: "/projects",
    }
]

export default function AppSidebar() {
    const { open, openMobile, isMobile } = useSidebar();
    const pathname = usePathname();
    const isSidebarOpen = (open && !isMobile) || (openMobile && isMobile);

    const sidebarItemComponents = sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild className={(isActive ? "bg-sidebar-accent" : "")} >
                    <Link href={item.href}>
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    });

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.svg" alt="Projectile" width={100} height={100} className="w-8 h-8" />
                            {isSidebarOpen && <span className="text-lg font-bold">Projectile</span>}
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>General</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarItemComponents}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>


            <SidebarFooter>
                {isSidebarOpen && (
                    <div className="p-2 w-full">
                        <div className="w-full [&>*]:w-full [&_button]:w-full [&_button]:justify-start">
                            <OrganizationSwitcher 
                                appearance={{
                                    elements: {
                                        rootBox: "!w-full !flex !flex-col",
                                        organizationSwitcherTrigger: "!w-full !justify-start !h-8 !px-2 !rounded-md hover:!bg-sidebar-accent hover:!text-sidebar-accent-foreground !border-0 !bg-transparent !flex !items-center !gap-2",
                                        organizationSwitcherTriggerIcon: "!w-4 !h-4 !flex-shrink-0",
                                        organizationPreview: "!w-full !justify-start !flex !items-center !gap-2",
                                        organizationPreviewTextContainer: "!flex-1 !text-left !min-w-0",
                                        organizationPreviewMainIdentifier: "!text-sm !font-medium !text-sidebar-foreground !truncate",
                                        organizationPreviewSecondaryIdentifier: "!text-xs !text-sidebar-muted-foreground !truncate"
                                    }
                                }}
                                hidePersonal={true}
                            />
                        </div>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}