import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export type Chat = { messages: string[]; id: string }

type State = {
  chats: Chat[]
  currentChatId: string

  getChat: (id: string) => Chat | undefined
  currentChat: () => Chat | undefined
  isChatEmpty: () => boolean
  setCurrentChatId: (id: string) => void
  resetChat: () => void
  deleteChat: (id: string) => void
  addChatMessage: (message: string) => void
}

export const useChatStore = create<State>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: '',

      getChat: (id: string) => get().chats.find((chat) => chat.id === id),
      currentChat: () => {
        const state = get()
        return get().chats.find((chat) => chat.id === state.currentChatId)
      },

      isChatEmpty: () => {
        const current = get().currentChat()

        return !current || current.messages.length === 0
      },

      setCurrentChatId: (id: string) => set({ currentChatId: id }),

      resetChat: () => {
        const newChatId = uuidv4()
        const chats = [...get().chats, { messages: [], id: newChatId }]
        set({ chats, input: '', currentChatId: newChatId })
      },

      deleteChat: (id: string) => {
        const filteredChats = get().chats.filter((chat) => chat.id !== id)
        const currentChatId = get().currentChatId

        if (currentChatId === id) {
          const newChatId = uuidv4()
          set({
            chats: [...filteredChats, { messages: [], id: newChatId }],
            currentChatId: newChatId,
          })
          return
        }
        set({ chats: filteredChats })
      },

      addChatMessage: (message: string) => {
        set({
          chats: get().chats.map((chat) =>
            chat.id === get().currentChatId
              ? { ...chat, messages: [...chat.messages, message] }
              : chat
          ),
        })
      },
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
