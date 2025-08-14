import React from 'react'

export const metadata = {
  title: 'Farcaster Tip dApp',
  description: 'Send ETH tips on Base with ENS & Farcaster',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen">
        <header className="border-b sticky top-0 z-40 bg-white/70 dark:bg-gray-950/70 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <img src="/logo.svg" alt="logo" className="h-6" />
              Farcaster Tip dApp
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/stats" className="hover:underline">
                Stats
              </a>
              <a href="/history" className="hover:underline">
                History
              </a>
              <a href="/admin" className="hover:underline">
                Admin
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-gray-500">
          Built on Base • ENS + Farcaster
        </footer>
      </body>
    </html>
  )
}