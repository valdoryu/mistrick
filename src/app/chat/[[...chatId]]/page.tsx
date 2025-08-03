'use client'
import Chat from '@/features/chat'
import { useParams } from 'next/navigation'

export default function ChatPage() {
  const params = useParams()
  const chatId = params?.chatId as string | undefined

  return <Chat chatId={chatId} />
}
