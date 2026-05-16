'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import VisitorTracker from './VisitorTracker'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Header />}
      {!isAdmin && <VisitorTracker />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}
