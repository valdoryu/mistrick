import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatField from '../ChatField'

describe('ChatField', () => {
  it('renders with placeholder text', () => {
    const mockOnEnter = jest.fn()

    render(<ChatField onEnter={mockOnEnter} />)

    expect(
      screen.getByPlaceholderText("Posez n'importe quelle question à Le Chat")
    ).toBeInTheDocument()
  })

  it('updates input value when typing', () => {
    const mockOnEnter = jest.fn()

    render(<ChatField onEnter={mockOnEnter} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Hello world' } })

    expect(input).toHaveValue('Hello world')
  })

  it('calls onEnter with input value when Enter key is pressed', () => {
    const mockOnEnter = jest.fn()

    render(<ChatField onEnter={mockOnEnter} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnEnter).toHaveBeenCalledWith('Test message')
    expect(mockOnEnter).toHaveBeenCalledTimes(1)
  })

  it('clears input after Enter key is pressed', () => {
    const mockOnEnter = jest.fn()

    render(<ChatField onEnter={mockOnEnter} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(input).toHaveValue('')
  })

  it('handles empty input when Enter is pressed', () => {
    const mockOnEnter = jest.fn()

    render(<ChatField onEnter={mockOnEnter} />)

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnEnter).toHaveBeenCalledWith('')
    expect(mockOnEnter).toHaveBeenCalledTimes(1)
  })

  it('does not call onEnter for other keys', () => {
    const mockOnEnter = jest.fn()

    render(<ChatField onEnter={mockOnEnter} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyDown(input, { key: 'Space' })
    fireEvent.keyDown(input, { key: 'Tab' })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(mockOnEnter).not.toHaveBeenCalled()
    expect(input).toHaveValue('Test message')
  })

  it('handles multiple Enter presses correctly', () => {
    const mockOnEnter = jest.fn()

    render(<ChatField onEnter={mockOnEnter} />)

    const input = screen.getByRole('textbox')

    // First message
    fireEvent.change(input, { target: { value: 'First message' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    // Second message
    fireEvent.change(input, { target: { value: 'Second message' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnEnter).toHaveBeenCalledTimes(2)
    expect(mockOnEnter).toHaveBeenNthCalledWith(1, 'First message')
    expect(mockOnEnter).toHaveBeenNthCalledWith(2, 'Second message')
    expect(input).toHaveValue('')
  })

  it('handles special characters and emojis', () => {
    const mockOnEnter = jest.fn()

    render(<ChatField onEnter={mockOnEnter} />)

    const input = screen.getByRole('textbox')
    const specialMessage = 'Hello! 🎉 Special chars: @#$%^&*()'

    fireEvent.change(input, { target: { value: specialMessage } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnEnter).toHaveBeenCalledWith(specialMessage)
  })

  it('handles long text input', () => {
    const mockOnEnter = jest.fn()

    render(<ChatField onEnter={mockOnEnter} />)

    const input = screen.getByRole('textbox')
    const longMessage =
      'This is a very long message that contains multiple words and should be handled properly by the component without breaking the functionality.'

    fireEvent.change(input, { target: { value: longMessage } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnEnter).toHaveBeenCalledWith(longMessage)
    expect(input).toHaveValue('')
  })
})
