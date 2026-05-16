'use client'

import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import app from './firebase'

// Functions instead of module-level instances — safe for SSR since called only from browser context
export function getFirebaseAuth() {
  return getAuth(app)
}

export function getFirebaseStorage() {
  return getStorage(app)
}
