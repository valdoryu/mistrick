'use client'

import Link from "next/link";
import Tag from "./Tag";
import { ComponentType } from "react";
import { usePathname } from "next/navigation";

type Props = {
  is_beta?: boolean;
  href: string;
  label: string;
  Icon: ComponentType<{ className: string }>;
}

export default function SidebarLink({ is_beta, href, label, Icon }: Props) {
  const pathname = usePathname();

  const is_active = pathname === href;

  return (
    <Link
      className={`flex justify-between text-sm items-center px-5.5 h-10 transition-colors group/button border-l-transparent border-l-2 data-[active=true]:bg-gray-200 data-[active=true]:border-primary hover:bg-gray-200 hover:border-primary`}
      data-active={is_active}
      href={href}
    >
      <span className="font-semibold">{label}</span>
      <div className="flex items-center gap-5">
        {is_beta && <Tag label="Beta" />}

        <Icon className="h-5 w-5 transition-colors group-hover/button:text-primary" />
      </div>
    </Link>
  );
}
