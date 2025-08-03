import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/layouts/root'
import './globals.css'

const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mistrick AI',
  description:
    'Getting tricked into thinking you are talking to Mistral but its Gemini instead',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} antialiased`}>
        <main className="flex h-screen w-screen">
          <Sidebar className="w-[300px]" />
          <div className="flex-1">{children}</div>
        </main>
      </body>
    </html>
  )
}
