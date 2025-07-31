export default function IconButton({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <button type="button" className={`flex items-center justify-center text-center font-medium cursor-pointer outline-hidden focus-visible:ring-3 whitespace-nowrap transition-colors focus-visible:ring-default focus-visible:ring-offset-1 text-default hover:bg-gray-50 border-border border-[0.5px] h-9 w-9 text-sm rounded-md shrink-0 gap-0 overflow-hidden px-0 ${className}`}>
      {children}
    </button>
  )
}