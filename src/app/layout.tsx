import type { Metadata } from 'next'
import '../index.css'

export const metadata: Metadata = {
  title: 'Pixel Pet Game',
  description: 'A React-based virtual pet care application with a retro pixel art aesthetic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}