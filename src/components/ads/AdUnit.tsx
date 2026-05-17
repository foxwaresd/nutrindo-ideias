'use client'

import { useEffect } from 'react'
import { ADSENSE_CLIENT } from '@/lib/ads'

declare global {
  interface Window { adsbygoogle: unknown[] }
}

interface Props {
  slot: string
  format?: string
  responsive?: boolean
  style?: React.CSSProperties
  className?: string
  label?: string
}

export default function AdUnit({ slot, format = 'auto', responsive = true, style, className = '', label = 'Publicidade' }: Props) {
  useEffect(() => {
    if (!slot) return
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [slot])

  if (!slot) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-300 gap-1 ${className}`}
        style={style}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3z" />
        </svg>
        <span className="text-xs">{label}</span>
      </div>
    )
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  )
}
