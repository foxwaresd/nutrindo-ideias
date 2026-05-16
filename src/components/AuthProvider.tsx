'use client'

import { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase-client'
import { isAdmin } from '@/lib/firestore'

interface AuthContextValue {
  user: User | null
  admin: boolean
  loading: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // getFirebaseAuth() is called here (browser-only), not at module level
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const adminStatus = await isAdmin(firebaseUser.uid)
        setAdmin(adminStatus)
      } else {
        setAdmin(false)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, admin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
