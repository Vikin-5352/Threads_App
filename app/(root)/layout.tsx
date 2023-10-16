import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TopBar from '@/Components/shared/TopBar'

import { ClerkProvider } from '@clerk/nextjs'
import LeftSideBar from '@/Components/shared/LeftSideBar'
import RightSideBar from '@/Components/shared/RightSideBar'
import BottomBar from '@/Components/shared/BottomBar'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Threads',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        {/* {children} */}
        <TopBar/>
        <main className='flex'>
          <LeftSideBar/>
          <section className="main-container">
            <div className="w-full max-w-4xl">
              {children}
            </div>
          </section>
          <RightSideBar/>
        </main>
        <BottomBar/>
        </body>
    </html>
    </ClerkProvider>
  )
}