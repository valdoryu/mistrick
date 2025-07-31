'use client'

import SidebarContent from "./SidebarContent";
import SidebarHeader from "./SidebarHeader";



export default function Sidebar({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col h-screen border-r-2 border-border ${className}`}>

      <SidebarHeader />
      <SidebarContent />
      {/* <SidebarFooter /> */}

    </div>
  );
}
