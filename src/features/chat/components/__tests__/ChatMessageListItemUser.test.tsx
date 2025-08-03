import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatMessageListItemUser from '../ChatMessageListItemUser'

describe('ChatMessageListItemUser', () => {
  it('renders with the provided message', () => {
    const testMessage = 'Hello, this is a test message!'

    render(<ChatMessageListItemUser message={testMessage} />)

    expect(screen.getByText(testMessage)).toBeInTheDocument()
  })

  it('handles empty message', () => {
    render(<ChatMessageListItemUser message="" />)

    const messageBubble = screen.getByRole('generic')
    expect(messageBubble).toBeInTheDocument()
  })

  it('handles long messages', () => {
    const longMessage =
      'This is a very long message that contains multiple words and should be handled properly by the component without breaking the layout or functionality of the user interface.'

    render(<ChatMessageListItemUser message={longMessage} />)

    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })
})
