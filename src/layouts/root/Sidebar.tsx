'use client'

import SidebarHistory from './SidebarHistory'
import SidebarNav from './SidebarNav'

export default function Sidebar({ className }: { className?: string }) {
  return (
    <div
      className={`border-border flex h-screen flex-col border-r-2 ${className}`}
    >
      <SidebarNav />
      <SidebarHistory className="mt-10" />
    </div>
  )
}
