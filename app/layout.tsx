import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'ShowReady Artist Portal',
  description: 'Submit your show documents securely through your personal ShowReady portal.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
