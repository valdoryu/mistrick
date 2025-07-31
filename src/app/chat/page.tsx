import Chat from "@/components/Chat";
import LogoIcon from "@/components/icons/logo";

export default function ChatPage() {
  return <div className="relative flex flex-col items-center justify-center h-full w-full">
    <LogoIcon className="absolute bottom-[65%]" />
    <Chat className="absolute top-[40%]" />
  </div>;
}