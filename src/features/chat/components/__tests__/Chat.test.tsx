import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Chat from '../Chat'
import { useChatStore } from '../../store'
import { postChat } from '../../services'
import { useRouter } from 'next/navigation'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the chat store
jest.mock('../../store', () => ({
  useChatStore: jest.fn(),
}))

// Mock the chat service
jest.mock('../../services', () => ({
  postChat: jest.fn(),
}))

// Mock child components
jest.mock('../ChatField', () => {
  return function MockChatField({
    onEnter,
  }: {
    onEnter: (input: string) => void
  }) {
    return (
      <input
        data-testid="chat-field"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onEnter((e.target as HTMLInputElement).value)
          }
        }}
      />
    )
  }
})

jest.mock('../ChatMessageList', () => {
  return function MockChatMessageList() {
    return <div data-testid="chat-message-list">Chat Messages</div>
  }
})

jest.mock('@/components/Button', () => {
  return function MockButton({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
  }) {
    return (
      <button data-testid="button" onClick={onClick} className={className}>
        {children}
      </button>
    )
  }
})

// Mock icon components
jest.mock('@/components/icons/logo', () => {
  return function MockLogoIcon() {
    return <div data-testid="logo-icon">Logo</div>
  }
})

jest.mock('@/components/icons/new-chat', () => {
  return function MockNewChatIcon({ className }: { className?: string }) {
    return (
      <div data-testid="new-chat-icon" className={className}>
        NewChat
      </div>
    )
  }
})

jest.mock('@/components/icons/plus', () => {
  return function MockPlusIcon() {
    return <div data-testid="plus-icon">Plus</div>
  }
})

const mockUseChatStore = useChatStore as jest.MockedFunction<
  typeof useChatStore
>
const mockPostChat = postChat as jest.MockedFunction<typeof postChat>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

const mockStore = {
  getChat: jest.fn(),
  setCurrentChatId: jest.fn(),
  resetChat: jest.fn(),
  addChatMessage: jest.fn(),
}

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
} as unknown as ReturnType<typeof useRouter>

const mockChat = {
  id: 'test-chat-1',
  messages: ['User message', 'Agent response'],
}

describe('Chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue(mockRouter)
    mockUseChatStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = {
          chats: [],
          currentChatId: '',
          getChat: mockStore.getChat,
          setCurrentChatId: mockStore.setCurrentChatId,
          resetChat: mockStore.resetChat,
          deleteChat: jest.fn(),
          addChatMessage: mockStore.addChatMessage,
          isChatEmpty: () => false,
          currentChat: () => mockChat,
        }
        return selector(state)
      }
      return mockStore
    })
  })

  it('renders empty state with logo when chat is empty', () => {
    mockUseChatStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = {
          chats: [],
          currentChatId: '',
          getChat: mockStore.getChat,
          setCurrentChatId: mockStore.setCurrentChatId,
          resetChat: mockStore.resetChat,
          deleteChat: jest.fn(),
          addChatMessage: mockStore.addChatMessage,
          isChatEmpty: () => true,
          currentChat: () => undefined,
        }
        return selector(state)
      }
      return mockStore
    })

    render(<Chat />)

    expect(screen.getByTestId('logo-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('chat-message-list')).not.toBeInTheDocument()
    expect(screen.queryByText('Nouveau chat')).not.toBeInTheDocument()
  })

  it('renders chat state with messages when chat is not empty', () => {
    render(<Chat />)

    expect(screen.getByTestId('chat-message-list')).toBeInTheDocument()
    expect(screen.getByText('Nouveau chat')).toBeInTheDocument()
    expect(screen.queryByTestId('logo-icon')).not.toBeInTheDocument()
  })

  it('renders ChatField component', () => {
    render(<Chat />)

    expect(screen.getByTestId('chat-field')).toBeInTheDocument()
  })

  it('renders plus buttons', () => {
    render(<Chat />)

    const plusButtons = screen.getAllByTestId('plus-icon')
    expect(plusButtons).toHaveLength(2)
  })

  it('shows disclaimer text when chat is not empty', () => {
    render(<Chat />)

    expect(
      screen.getByText("Le Chat ne fait pas d'erreur.")
    ).toBeInTheDocument()
  })

  it('does not show disclaimer text when chat is empty', () => {
    mockUseChatStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = {
          chats: [],
          currentChatId: '',
          getChat: mockStore.getChat,
          setCurrentChatId: mockStore.setCurrentChatId,
          resetChat: mockStore.resetChat,
          deleteChat: jest.fn(),
          addChatMessage: mockStore.addChatMessage,
          isChatEmpty: () => true,
          currentChat: () => undefined,
        }
        return selector(state)
      }
      return mockStore
    })

    render(<Chat />)

    expect(
      screen.queryByText("Le Chat ne fait pas d'erreur.")
    ).not.toBeInTheDocument()
  })

  it('calls resetChat and navigates on new chat button click', () => {
    render(<Chat />)

    const newChatButton = screen.getByText('Nouveau chat').closest('button')
    if (newChatButton) {
      fireEvent.click(newChatButton)
    }

    expect(mockStore.resetChat).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith('/chat')
  })

  it('handles chat message sending', async () => {
    mockPostChat.mockResolvedValue('Agent response')

    render(<Chat />)

    const chatField = screen.getByTestId('chat-field')
    fireEvent.change(chatField, { target: { value: 'Test message' } })
    fireEvent.keyDown(chatField, { key: 'Enter' })

    await waitFor(() => {
      expect(mockStore.addChatMessage).toHaveBeenCalledWith('Test message')
    })

    await waitFor(() => {
      expect(postChat).toHaveBeenCalledWith('Test message')
    })

    await waitFor(() => {
      expect(mockStore.addChatMessage).toHaveBeenCalledWith('Agent response')
    })
  })

  it('navigates to chat URL after sending first message in empty chat', async () => {
    const isEmptyChat = true
    mockUseChatStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = {
          chats: [],
          currentChatId: '',
          getChat: mockStore.getChat,
          setCurrentChatId: mockStore.setCurrentChatId,
          resetChat: mockStore.resetChat,
          deleteChat: jest.fn(),
          addChatMessage: mockStore.addChatMessage,
          isChatEmpty: () => isEmptyChat,
          currentChat: () => mockChat,
        }
        return selector(state)
      }
      return mockStore
    })

    mockPostChat.mockResolvedValue('Agent response')

    render(<Chat />)

    // Simulate sending a message in an empty chat
    const chatField = screen.getByTestId('chat-field')
    fireEvent.change(chatField, { target: { value: 'First message' } })
    fireEvent.keyDown(chatField, { key: 'Enter' })

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/chat/test-chat-1')
    })
  })

  it('does not navigate when sending message in non-empty chat', async () => {
    mockPostChat.mockResolvedValue('Agent response')

    render(<Chat />)

    const chatField = screen.getByTestId('chat-field')
    fireEvent.change(chatField, { target: { value: 'Another message' } })
    fireEvent.keyDown(chatField, { key: 'Enter' })

    await waitFor(() => {
      expect(postChat).toHaveBeenCalledWith('Another message')
    })

    // Should not navigate because chat is not empty
    expect(mockRouter.push).not.toHaveBeenCalledWith('/chat/test-chat-1')
  })

  it('does not send message when no current chat', async () => {
    mockUseChatStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = {
          chats: [],
          currentChatId: '',
          getChat: mockStore.getChat,
          setCurrentChatId: mockStore.setCurrentChatId,
          resetChat: mockStore.resetChat,
          deleteChat: jest.fn(),
          addChatMessage: mockStore.addChatMessage,
          isChatEmpty: () => false,
          currentChat: () => undefined,
        }
        return selector(state)
      }
      return mockStore
    })

    render(<Chat />)

    const chatField = screen.getByTestId('chat-field')
    fireEvent.change(chatField, { target: { value: 'Test message' } })
    fireEvent.keyDown(chatField, { key: 'Enter' })

    expect(mockStore.addChatMessage).not.toHaveBeenCalled()
    expect(postChat).not.toHaveBeenCalled()
  })

  it('sets current chat ID when chatId prop is provided and chat exists', () => {
    mockStore.getChat.mockReturnValue(mockChat)

    render(<Chat chatId="test-chat-1" />)

    expect(mockStore.getChat).toHaveBeenCalledWith('test-chat-1')
    expect(mockStore.setCurrentChatId).toHaveBeenCalledWith('test-chat-1')
  })

  it('does not set current chat ID when chatId prop is provided but chat does not exist', () => {
    mockStore.getChat.mockReturnValue(undefined)

    render(<Chat chatId="nonexistent-chat" />)

    expect(mockStore.getChat).toHaveBeenCalledWith('nonexistent-chat')
    expect(mockStore.setCurrentChatId).not.toHaveBeenCalled()
  })

  it('resets chat when no chatId prop is provided', () => {
    render(<Chat />)

    expect(mockStore.resetChat).toHaveBeenCalledTimes(1)
  })

  it('handles chat ID changes', () => {
    mockStore.getChat.mockReturnValue(mockChat)

    const { rerender } = render(<Chat chatId="chat-1" />)

    expect(mockStore.setCurrentChatId).toHaveBeenCalledWith('chat-1')

    mockStore.setCurrentChatId.mockClear()
    mockStore.getChat.mockReturnValue({ id: 'chat-2', messages: [] })

    rerender(<Chat chatId="chat-2" />)

    expect(mockStore.getChat).toHaveBeenCalledWith('chat-2')
    expect(mockStore.setCurrentChatId).toHaveBeenCalledWith('chat-2')
  })
})
