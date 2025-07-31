import IconButton from "./IconButton";
import PlusIcon from "./icons/plus";

export default function Chat({ className }: { className: string }) {
  return (
    <div className={`w-full max-w-[700px] bg-white rounded-xl px-4 pt-3 pb-4 ${className}`}>
      <input
        type="text"
        placeholder="Posez n'importe quelle question à Le Chat"
        className="w-full h-6 outline-none placeholder-gray-400 caret-primary"
      />

      <div className="mt-5 flex">
        <IconButton >
          <PlusIcon />
        </IconButton>
      </div>
    </div>
  )
}