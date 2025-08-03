export default function ChatMessageListItemUser({
  message,
}: {
  message: string
}) {
  return (
    <div className="align-center flex justify-end gap-2">
      <div className="rounded-xl bg-gray-200 px-3 py-2">{message}</div>
    </div>
  )
}
