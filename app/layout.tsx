import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pickr — Let the community decide',
  description: 'Submit two photos, let the community vote for the best one.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}