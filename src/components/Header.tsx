'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase-client'

export default function Header() {
  const { user, admin, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignIn() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(getFirebaseAuth(), provider)
  }

  async function handleSignOut() {
    await signOut(getFirebaseAuth())
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shadow-sm group-hover:bg-green-700 transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V13M12 13C12 9 9 6 5 6C5 10 8 13 12 13ZM12 13C12 9 15 6 19 6C19 10 16 13 12 13Z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">
              Nutrindo <span className="text-green-600">Ideias</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {admin && (
              <Link href="/admin" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Novo Post
              </Link>
            )}

            {!loading && (
              user ? (
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-full focus:outline-none">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full ring-2 ring-green-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center ring-2 ring-green-200">
                        <span className="text-green-700 font-semibold text-sm">{user.displayName?.[0] || '?'}</span>
                      </div>
                    )}
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {admin && (
                        <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Painel Admin
                        </Link>
                      )}
                      <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={handleSignIn} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Entrar
                </button>
              )
            )}
          </div>
        </div>
      </div>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </header>
  )
}
