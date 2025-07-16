"use client";

import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

export default function AppTopbar() {
    const { state, isMobile } = useSidebar();
    
    return (
        <div className={`flex items-center justify-between p-4 border-b fixed top-0 h-14 transition-[left,width] duration-200 ease-linear z-40 bg-background
            ${isMobile 
                ? "left-0 w-full" 
                : state === "expanded" 
                    ? "left-64 w-[calc(100%-16rem)]" 
                    : "left-12 w-[calc(100%-3rem)]"
            }`}>
            <div className="flex items-center gap-2">
                <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
                <UserButton />
            </div>
        </div>
    )
}