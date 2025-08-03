import AgentIcon from '@/components/icons/agent'

export default function ChatMessageListItemAgent({
  message,
}: {
  message: string | null
}) {
  let formattedMessage = message ?? ''

  formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')

  return (
    <div className="align-center mt-8 flex justify-start gap-2">
      <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-lg text-white">
        <AgentIcon />
      </div>

      <div dangerouslySetInnerHTML={{ __html: formattedMessage }} />
    </div>
  )
}
