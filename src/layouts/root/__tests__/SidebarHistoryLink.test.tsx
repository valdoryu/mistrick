import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SidebarHistoryLink from '../SidebarHistoryLink'
import { useChatStore } from '@/features/chat'
import { usePathname } from 'next/navigation'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock the chat store
jest.mock('@/features/chat', () => ({
  useChatStore: jest.fn(),
}))

// Mock the TrashIcon component
jest.mock('@/components/icons/trash', () => {
  return function MockTrashIcon({ className }: { className?: string }) {
    return (
      <div data-testid="trash-icon" className={className}>
        Trash
      </div>
    )
  }
})

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockUseChatStore = useChatStore as jest.MockedFunction<
  typeof useChatStore
>

const mockChat = {
  id: 'test-chat-1',
  messages: ['First message', 'Agent response'],
}

const mockStore = {
  deleteChat: jest.fn(),
  setCurrentChatId: jest.fn(),
}

describe('SidebarHistoryLink', () => {
  beforeEach(() => {
    mockUsePathname.mockClear()
    mockUseChatStore.mockClear()
    mockStore.deleteChat.mockClear()
    mockStore.setCurrentChatId.mockClear()
    mockUseChatStore.mockReturnValue(mockStore)
  })

  it('renders chat title from first message', () => {
    mockUsePathname.mockReturnValue('/other')

    render(<SidebarHistoryLink chat={mockChat} />)

    expect(screen.getByText('First message')).toBeInTheDocument()
  })

  it('renders delete button with trash icon', () => {
    mockUsePathname.mockReturnValue('/other')

    render(<SidebarHistoryLink chat={mockChat} />)

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
  })

  it('shows active state when pathname matches chat URL', () => {
    mockUsePathname.mockReturnValue('/chat/test-chat-1')

    render(<SidebarHistoryLink chat={mockChat} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('data-active', 'true')
  })

  it('shows inactive state when pathname does not match chat URL', () => {
    mockUsePathname.mockReturnValue('/chat/other-chat')

    render(<SidebarHistoryLink chat={mockChat} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('data-active', 'false')
  })

  it('has correct href attribute', () => {
    mockUsePathname.mockReturnValue('/other')

    render(<SidebarHistoryLink chat={mockChat} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/chat/test-chat-1')
  })

  it('calls setCurrentChatId when link is clicked', () => {
    mockUsePathname.mockReturnValue('/other')

    render(<SidebarHistoryLink chat={mockChat} />)

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(mockStore.setCurrentChatId).toHaveBeenCalledWith('test-chat-1')
    expect(mockStore.setCurrentChatId).toHaveBeenCalledTimes(1)
  })

  it('calls deleteChat when delete button is clicked', () => {
    mockUsePathname.mockReturnValue('/other')

    render(<SidebarHistoryLink chat={mockChat} />)

    const deleteButton = screen.getByTestId('trash-icon').parentElement
    if (deleteButton) {
      fireEvent.click(deleteButton)
    }

    expect(mockStore.deleteChat).toHaveBeenCalledWith('test-chat-1')
    expect(mockStore.deleteChat).toHaveBeenCalledTimes(1)
  })

  it('prevents link click when delete button is clicked', () => {
    mockUsePathname.mockReturnValue('/other')

    render(<SidebarHistoryLink chat={mockChat} />)

    const deleteButton = screen.getByTestId('trash-icon').parentElement
    if (deleteButton) {
      fireEvent.click(deleteButton)
    }

    // setCurrentChatId should not be called when delete is clicked
    expect(mockStore.setCurrentChatId).not.toHaveBeenCalled()
  })

  it('handles chat with empty messages array', () => {
    mockUsePathname.mockReturnValue('/other')
    const emptyChatMock = {
      id: 'empty-chat',
      messages: [],
    }

    render(<SidebarHistoryLink chat={emptyChatMock} />)

    // Should not crash and should render the component
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
  })

  it('handles long chat titles correctly', () => {
    mockUsePathname.mockReturnValue('/other')
    const longTitleChat = {
      id: 'long-title-chat',
      messages: [
        'This is a very long message that should be truncated in the sidebar history',
        'Agent response',
      ],
    }

    render(<SidebarHistoryLink chat={longTitleChat} />)

    expect(
      screen.getByText(
        'This is a very long message that should be truncated in the sidebar history'
      )
    ).toBeInTheDocument()
  })

  it('updates active state when pathname changes', () => {
    mockUsePathname.mockReturnValue('/chat/test-chat-1')

    const { rerender } = render(<SidebarHistoryLink chat={mockChat} />)

    expect(screen.getByRole('link')).toHaveAttribute('data-active', 'true')

    // Simulate pathname change
    mockUsePathname.mockReturnValue('/chat/other-chat')

    rerender(<SidebarHistoryLink chat={mockChat} />)

    expect(screen.getByRole('link')).toHaveAttribute('data-active', 'false')
  })
})
