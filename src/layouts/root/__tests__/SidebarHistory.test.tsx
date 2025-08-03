import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SidebarHistory from '../SidebarHistory'
import { Chat, useChatStore } from '@/features/chat'

// Mock the chat store
jest.mock('@/features/chat', () => ({
  useChatStore: jest.fn(),
}))

// Mock SidebarHistoryLink component
jest.mock('../SidebarHistoryLink', () => {
  return function MockSidebarHistoryLink({ chat }: { chat: Chat }) {
    return (
      <div data-testid="sidebar-history-link" data-chat-id={chat.id}>
        {chat.messages[0]}
      </div>
    )
  }
})

const mockUseChatStore = useChatStore as jest.MockedFunction<
  typeof useChatStore
>

describe('SidebarHistory', () => {
  beforeEach(() => {
    mockUseChatStore.mockClear()
  })

  it('renders section label', () => {
    mockUseChatStore.mockReturnValue([])

    render(<SidebarHistory />)

    expect(screen.getByText('Hier')).toBeInTheDocument()
  })

  it('renders empty state when no chats', () => {
    mockUseChatStore.mockReturnValue([])

    render(<SidebarHistory />)

    expect(screen.getByText('Hier')).toBeInTheDocument()
    expect(screen.queryByTestId('sidebar-history-link')).not.toBeInTheDocument()
  })

  it('renders chat history links for chats with messages', () => {
    const mockChats = [
      { id: 'chat-1', messages: ['First message', 'Response'] },
      { id: 'chat-2', messages: ['Second message', 'Response'] },
      { id: 'chat-3', messages: ['Third message'] },
    ]

    mockUseChatStore.mockReturnValue(mockChats)

    render(<SidebarHistory />)

    expect(screen.getByText('First message')).toBeInTheDocument()
    expect(screen.getByText('Second message')).toBeInTheDocument()
    expect(screen.getByText('Third message')).toBeInTheDocument()
  })

  it('filters out chats with no messages', () => {
    const mockChats = [
      { id: 'chat-1', messages: ['First message'] },
      { id: 'chat-2', messages: [] }, // Empty chat
      { id: 'chat-3', messages: ['Third message'] },
    ]

    mockUseChatStore.mockReturnValue(mockChats)

    render(<SidebarHistory />)

    const historyLinks = screen.getAllByTestId('sidebar-history-link')
    expect(historyLinks).toHaveLength(2)
    expect(screen.getByText('First message')).toBeInTheDocument()
    expect(screen.getByText('Third message')).toBeInTheDocument()
  })

  it('displays chats in reverse order (newest first)', () => {
    const mockChats = [
      { id: 'chat-1', messages: ['Oldest message'] },
      { id: 'chat-2', messages: ['Middle message'] },
      { id: 'chat-3', messages: ['Newest message'] },
    ]

    mockUseChatStore.mockReturnValue(mockChats)

    render(<SidebarHistory />)

    const historyLinks = screen.getAllByTestId('sidebar-history-link')

    // Should be in reverse order: newest first
    expect(historyLinks[0]).toHaveAttribute('data-chat-id', 'chat-3')
    expect(historyLinks[1]).toHaveAttribute('data-chat-id', 'chat-2')
    expect(historyLinks[2]).toHaveAttribute('data-chat-id', 'chat-1')
  })

  it('applies custom className when provided', () => {
    mockUseChatStore.mockReturnValue([])

    const { container } = render(<SidebarHistory className="custom-class" />)

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('handles single chat correctly', () => {
    const mockChats = [{ id: 'only-chat', messages: ['Only message'] }]

    mockUseChatStore.mockReturnValue(mockChats)

    render(<SidebarHistory />)

    expect(screen.getByTestId('sidebar-history-link')).toBeInTheDocument()
    expect(screen.getByText('Only message')).toBeInTheDocument()
  })

  it('handles chats with only empty arrays', () => {
    const mockChats = [
      { id: 'empty-1', messages: [] },
      { id: 'empty-2', messages: [] },
    ]

    mockUseChatStore.mockReturnValue(mockChats)

    render(<SidebarHistory />)

    expect(screen.queryByTestId('sidebar-history-link')).not.toBeInTheDocument()
    expect(screen.getByText('Hier')).toBeInTheDocument()
  })

  it('handles mixed empty and non-empty chats', () => {
    const mockChats = [
      { id: 'empty-1', messages: [] },
      { id: 'with-message', messages: ['Valid message'] },
      { id: 'empty-2', messages: [] },
    ]

    mockUseChatStore.mockReturnValue(mockChats)

    render(<SidebarHistory />)

    const historyLinks = screen.getAllByTestId('sidebar-history-link')
    expect(historyLinks).toHaveLength(1)
    expect(screen.getByText('Valid message')).toBeInTheDocument()
  })
})
