import TrashIcon from '@/components/icons/trash'
import { Chat, useChatStore } from '@/features/chat'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function SidebarHistoryLink({ chat }: { chat: Chat }) {
  const store = useChatStore()

  const pathname = usePathname()

  const is_active = useMemo(
    () => pathname === `/chat/${chat.id}`,
    [pathname, chat.id]
  )

  const onDelete = (e: React.MouseEvent<HTMLSpanElement>, id: string) => {
    e.stopPropagation()
    store.deleteChat(id)
  }

  return (
    <Link
      href={`/chat/${chat.id}`}
      onClick={() => store.setCurrentChatId(chat.id)}
      className="group/button flex h-10 cursor-pointer items-center justify-between rounded-lg px-1.5 transition-colors hover:bg-gray-200 data-[active=true]:bg-gray-200"
      data-active={is_active}
    >
      <span className="truncate">{chat.messages[0]}</span>
      <span
        className="hidden rounded-sm p-1 group-hover/button:block hover:bg-gray-300"
        onClick={(e) => onDelete(e, chat.id)}
      >
        <TrashIcon className="size-3.5 text-gray-500" />
      </span>
    </Link>
  )
}
