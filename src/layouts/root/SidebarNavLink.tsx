'use client'

import Link from 'next/link'
import Tag from '@/components/Tag'
import { ComponentType, useMemo } from 'react'
import { usePathname } from 'next/navigation'

type Props = {
  is_beta?: boolean
  href: string
  label: string
  Icon: ComponentType<{ className: string }>
}

export default function SidebarNavLink({ is_beta, href, label, Icon }: Props) {
  const pathname = usePathname()

  const is_active = useMemo(() => pathname === href, [pathname, href])

  return (
    <Link
      className={`group/button data-[active=true]:border-primary hover:border-primary flex h-10 items-center justify-between border-l-2 border-l-transparent px-5.5 text-sm transition-colors hover:bg-gray-200 data-[active=true]:bg-gray-200`}
      data-active={is_active}
      href={href}
    >
      <span className="font-semibold">{label}</span>
      <div className="flex items-center gap-5">
        {is_beta && <Tag label="Beta" />}

        <Icon className="group-hover/button:text-primary h-5 w-5 transition-colors" />
      </div>
    </Link>
  )
}
