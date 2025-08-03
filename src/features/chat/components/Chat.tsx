'use client'

import LogoIcon from '@/components/icons/logo'
import PlusIcon from '@/components/icons/plus'
import Button from '@/components/Button'
import NewChatIcon from '@/components/icons/new-chat'
import { postChat } from '../services'
import { useChatStore } from '../store'
import ChatField from './ChatField'
import ChatMessageList from './ChatMessageList'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Chat({ chatId }: { chatId?: string }) {
  const store = useChatStore()
  const isChatEmpty = useChatStore((state) => state.isChatEmpty())
  const currentChat = useChatStore((state) => state.currentChat())

  const router = useRouter()

  useEffect(() => {
    if (chatId) {
      if (store.getChat(chatId)) {
        store.setCurrentChatId(chatId)
      }
    } else {
      store.resetChat()
    }
  }, [chatId])

  const onNewChat = () => {
    store.resetChat()
    router.push('/chat')
  }

  const onEnter = async (input: string) => {
    const chat = currentChat
    const isEmpty = isChatEmpty

    if (!chat) return

    store.addChatMessage(input)

    const response = await postChat(input)

    store.addChatMessage(response)

    if (isEmpty) {
      router.push(`/chat/${chat.id}`)
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {isChatEmpty ? (
        <div key="logo" className="absolute bottom-[50%] translate-y-[-130px]">
          <LogoIcon />
        </div>
      ) : (
        <div key="chat" className="absolute top-[80px] w-full max-w-[700px]">
          <ChatMessageList />
        </div>
      )}

      <div
        className={`transition-duration-300 absolute bottom-[50%] flex w-full max-w-[700px] flex-col items-center transition-all ease-in-out data-[pushed=true]:bottom-[0%]`}
        data-pushed={!isChatEmpty}
      >
        {!isChatEmpty && (
          <Button className="mb-2 px-2" onClick={onNewChat}>
            <NewChatIcon className="mr-1 h-4 w-4" /> Nouveau chat
          </Button>
        )}

        <div className="w-full rounded-xl bg-white px-4 pt-3 pb-4 shadow-2xl shadow-neutral-200">
          <ChatField onEnter={onEnter} />

          <div className="mt-5 flex">
            <Button className="w-8">
              <PlusIcon />
            </Button>

            <Button className="ml-auto w-8">
              <PlusIcon />
            </Button>
          </div>
        </div>

        {!isChatEmpty && (
          <div className="my-2 text-center text-xs text-neutral-500">
            Le Chat ne fait pas d&apos;erreur.
          </div>
        )}
      </div>
    </div>
  )
}
