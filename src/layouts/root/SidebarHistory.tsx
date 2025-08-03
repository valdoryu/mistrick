import { useChatStore } from '@/features/chat'
import SidebarHistoryLink from './SidebarHistoryLink'

export default function SidebarHistory({ className }: { className?: string }) {
  const chats = useChatStore((state) => state.chats)
  const formattedChats = chats
    .filter((chat) => chat.messages.length > 0)
    .reverse()

  return (
    <div className={`px-4 ${className}`}>
      <label className="px-1.5 text-sm text-neutral-400">Hier</label>

      <ul className="mt-5 flex flex-col">
        {formattedChats.map((chat) => (
          <li key={chat.id}>
            <SidebarHistoryLink key={chat.id} chat={chat} />
          </li>
        ))}
      </ul>
    </div>
  )
}
