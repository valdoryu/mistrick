import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatMessageList from '../ChatMessageList'
import { useChatStore } from '../../store'

// Mock the store
jest.mock('../../store', () => ({
  useChatStore: jest.fn(),
}))

// Mock the child components
jest.mock('../ChatMessageListItemUser', () => {
  return function MockChatMessageListItemUser({
    message,
  }: {
    message: string
  }) {
    return <div data-testid="user-message">{message}</div>
  }
})

jest.mock('../ChatMessageListItemAgent', () => {
  return function MockChatMessageListItemAgent({
    message,
  }: {
    message: string
  }) {
    return <div data-testid="agent-message">{message}</div>
  }
})

const mockUseChatStore = useChatStore as jest.MockedFunction<
  typeof useChatStore
>

describe('ChatMessageList', () => {
  beforeEach(() => {
    mockUseChatStore.mockClear()
  })

  it('renders empty state when no current chat', () => {
    mockUseChatStore.mockReturnValue(undefined)

    const { container } = render(<ChatMessageList />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.queryByTestId('user-message')).not.toBeInTheDocument()
    expect(screen.queryByTestId('agent-message')).not.toBeInTheDocument()
  })

  it('renders empty state when chat has no messages', () => {
    mockUseChatStore.mockReturnValue({
      messages: [],
      id: 'test-chat-1',
    })

    const { container } = render(<ChatMessageList />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.queryByTestId('user-message')).not.toBeInTheDocument()
    expect(screen.queryByTestId('agent-message')).not.toBeInTheDocument()
  })

  it('renders single user message correctly', () => {
    mockUseChatStore.mockReturnValue({
      messages: ['Hello world'],
      id: 'test-chat-1',
    })

    render(<ChatMessageList />)

    expect(screen.getByTestId('user-message')).toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()
    expect(screen.queryByTestId('agent-message')).not.toBeInTheDocument()
  })

  it('renders multiple messages alternating between user and agent', () => {
    mockUseChatStore.mockReturnValue({
      messages: [
        'User message 1',
        'Agent response 1',
        'User message 2',
        'Agent response 2',
      ],
      id: 'test-chat-1',
    })

    render(<ChatMessageList />)

    // Check user messages (even indices: 0, 2)
    const userMessages = screen.getAllByTestId('user-message')
    expect(userMessages).toHaveLength(2)
    expect(screen.getByText('User message 1')).toBeInTheDocument()
    expect(screen.getByText('User message 2')).toBeInTheDocument()

    // Check agent messages (odd indices: 1, 3)
    const agentMessages = screen.getAllByTestId('agent-message')
    expect(agentMessages).toHaveLength(2)
    expect(screen.getByText('Agent response 1')).toBeInTheDocument()
    expect(screen.getByText('Agent response 2')).toBeInTheDocument()
  })

  it('handles odd number of messages correctly', () => {
    mockUseChatStore.mockReturnValue({
      messages: ['User message 1', 'Agent response 1', 'User message 2'],
      id: 'test-chat-1',
    })

    render(<ChatMessageList />)

    expect(screen.getAllByTestId('user-message')).toHaveLength(2)
    expect(screen.getAllByTestId('agent-message')).toHaveLength(1)
  })

  it('applies custom className when provided', () => {
    mockUseChatStore.mockReturnValue({
      messages: [],
      id: 'test-chat-1',
    })

    const { container } = render(<ChatMessageList className="custom-class" />)

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('handles empty string messages', () => {
    mockUseChatStore.mockReturnValue({
      messages: ['', 'Agent response', ''],
      id: 'test-chat-1',
    })

    render(<ChatMessageList />)

    expect(screen.getAllByTestId('user-message')).toHaveLength(2)
    expect(screen.getAllByTestId('agent-message')).toHaveLength(1)
    expect(screen.getByText('Agent response')).toBeInTheDocument()
  })

  it('handles long conversation', () => {
    const messages = Array.from({ length: 10 }, (_, i) => `Message ${i + 1}`)
    mockUseChatStore.mockReturnValue({
      messages,
      id: 'test-chat-1',
    })

    render(<ChatMessageList />)

    expect(screen.getAllByTestId('user-message')).toHaveLength(5)
    expect(screen.getAllByTestId('agent-message')).toHaveLength(5)
  })
})
