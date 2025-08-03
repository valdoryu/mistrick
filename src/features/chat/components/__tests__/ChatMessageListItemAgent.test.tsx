import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatMessageListItemAgent from '../ChatMessageListItemAgent'

describe('ChatMessageListItemAgent', () => {
  it('renders with the provided message', () => {
    const testMessage = 'Hello, this is a test message!'

    render(<ChatMessageListItemAgent message={testMessage} />)

    expect(screen.getByText(testMessage)).toBeInTheDocument()
  })

  it('handles null message', () => {
    render(<ChatMessageListItemAgent message={null} />)

    const agentIcon = screen.getByRole('generic')
    expect(agentIcon).toBeInTheDocument()
  })

  it('handles empty message', () => {
    render(<ChatMessageListItemAgent message="" />)

    const agentIcon = screen.getByRole('generic')
    expect(agentIcon).toBeInTheDocument()
  })

  it('handles long messages', () => {
    const longMessage =
      'This is a very long message that contains multiple words and should be handled properly by the component without breaking the layout or functionality of the user interface.'

    render(<ChatMessageListItemAgent message={longMessage} />)

    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })

  it('converts markdown bold syntax to HTML bold tags', () => {
    const messageWithBold = 'This is **bold text** and this is normal text'

    const { container } = render(
      <ChatMessageListItemAgent message={messageWithBold} />
    )

    // Check that the bold text is converted to HTML
    const messageElement = container.querySelector('[dangerouslySetInnerHTML]')
    expect(messageElement?.innerHTML).toBe(
      'This is <b>bold text</b> and this is normal text'
    )
  })

  it('handles multiple bold sections in a message', () => {
    const messageWithMultipleBold = 'First **bold** and second **bold** section'

    const { container } = render(
      <ChatMessageListItemAgent message={messageWithMultipleBold} />
    )

    const messageElement = container.querySelector('[dangerouslySetInnerHTML]')
    expect(messageElement?.innerHTML).toBe(
      'First <b>bold</b> and second <b>bold</b> section'
    )
  })

  it('handles message without any bold syntax', () => {
    const normalMessage = 'This is just a normal message without any formatting'

    const { container } = render(
      <ChatMessageListItemAgent message={normalMessage} />
    )

    const messageElement = container.querySelector('[dangerouslySetInnerHTML]')
    expect(messageElement?.innerHTML).toBe(normalMessage)
  })

  it('handles edge case with incomplete bold syntax', () => {
    const messageWithIncompleteBold = 'This has **incomplete bold syntax'

    const { container } = render(
      <ChatMessageListItemAgent message={messageWithIncompleteBold} />
    )

    // Should not convert incomplete syntax
    const messageElement = container.querySelector('[dangerouslySetInnerHTML]')
    expect(messageElement?.innerHTML).toBe('This has **incomplete bold syntax')
  })
})
