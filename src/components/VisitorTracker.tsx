'use client'

import { useEffect } from 'react'
import { trackVisit } from '@/lib/firestore'

export default function VisitorTracker() {
  useEffect(() => {
    trackVisit().catch(() => {})
  }, [])
  return null
}
