export default function Button({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} type="button" className={`flex items-center justify-center bg-white text-center font-medium cursor-pointer outline-hidden focus-visible:ring-3 whitespace-nowrap transition-colors focus-visible:ring-default focus-visible:ring-offset-1 text-default hover:bg-gray-50 border-neutral-300 border-[0.5px] h-8 text-sm rounded-lg shrink-0 gap-0 overflow-hidden px-0 ${className}`}>
      {children}
    </button>
  )
}