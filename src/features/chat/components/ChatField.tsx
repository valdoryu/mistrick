import { useState } from 'react'

export default function ChatField({
  onEnter,
}: {
  onEnter: (input: string) => void
}) {
  const [input, setInput] = useState('')

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter(input)

      setInput('')
    }
  }

  return (
    <input
      type="text"
      placeholder="Posez n'importe quelle question à Le Chat"
      className="caret-primary h-6 w-full placeholder-gray-400 outline-none"
      onChange={(e) => setInput(e.target.value)}
      value={input}
      onKeyDown={onKeyDown}
    />
  )
}
