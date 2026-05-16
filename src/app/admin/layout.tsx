'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { useAuth } from '@/hooks/useAuth'
import { getFirebaseAuth } from '@/lib/firebase-client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, admin, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || !admin)) router.replace('/admin/login')
  }, [user, admin, loading, router])

  async function handleSignOut() {
    await signOut(getFirebaseAuth())
  }

  if (loading || !user || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { href: '/admin/novo', label: 'Novo Post', icon: 'M12 4v16m8-8H4' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V13M12 13C12 9 9 6 5 6C5 10 8 13 12 13ZM12 13C12 9 15 6 19 6C19 10 16 13 12 13Z" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-gray-900">Nutrindo Ideias</span>
              </Link>
              <span className="text-gray-300 text-lg">/</span>
              <span className="text-sm font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-lg">Admin</span>
              <nav className="hidden sm:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      pathname === link.href ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                    </svg>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" target="_blank" className="text-xs text-gray-500 hover:text-green-600 hidden sm:block">Ver site →</Link>
              <div className="flex items-center gap-2">
                {user.photoURL && <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />}
                <button onClick={handleSignOut} className="text-xs text-gray-500 hover:text-red-600 transition-colors">Sair</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
