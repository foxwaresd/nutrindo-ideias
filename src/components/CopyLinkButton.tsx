'use client'

import { useState } from 'react'
import { incrementShare } from '@/lib/firestore'

interface Props {
  postId?: string
}

export default function CopyLinkButton({ postId }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href)
    if (postId) incrementShare(postId).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copiar link
      </button>

      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          O link foi copiado — agora é só colar onde quiser para compartilhar!
        </div>
      )}
    </>
  )
}
