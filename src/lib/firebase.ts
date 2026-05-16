import { initializeApp, getApps, getApp } from 'firebase/app'
import { initializeFirestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isNew = getApps().length === 0
const app = isNew ? initializeApp(firebaseConfig) : getApp()
// experimentalForceLongPolling is required for Node.js (SSR) — gRPC WebChannel doesn't work server-side
export const db = isNew
  ? initializeFirestore(app, { experimentalForceLongPolling: true })
  : getFirestore(app)
export default app
