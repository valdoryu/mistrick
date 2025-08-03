import { useChatStore } from '../store'
import ChatMessageListItemAgent from './ChatMessageListItemAgent'
import ChatMessageListItemUser from './ChatMessageListItemUser'

export default function ChatMessageList({ className }: { className?: string }) {
  const chat = useChatStore((state) => state.currentChat())

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {chat?.messages.map((message, index) => (
        <div key={index}>
          {index % 2 === 0 ? (
            <ChatMessageListItemUser message={message} />
          ) : (
            <ChatMessageListItemAgent message={message} />
          )}
        </div>
      ))}
    </div>
  )
}
