import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Life Design Lab | 生命設計實驗室',
  description: '設計專屬你的人生劇本',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}