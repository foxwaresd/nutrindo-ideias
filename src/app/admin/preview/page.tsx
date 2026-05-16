'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface PreviewData {
  title: string
  content: string
  excerpt: string
  topic: string
  tags: string[]
  authorName: string
  authorPhotoUrl?: string
  coverImageUrl?: string
}

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('post-preview')
    if (raw) setData(JSON.parse(raw))
  }, [])

  if (!data) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center text-center px-4 py-20 text-gray-400">
        <p className="text-lg font-medium">Nenhuma prévia disponível.</p>
        <p className="text-sm mt-1">Abra a prévia a partir do formulário de post.</p>
        <Link href="/admin/novo" className="mt-6 text-green-600 hover:underline text-sm">Voltar ao formulário</Link>
      </div>
    )
  }

  const today = new Date()

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Modo de prévia — não publicado
        </span>
        <button onClick={() => window.close()} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Fechar
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {data.topic && (
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {data.topic}
          </span>
        )}
        {data.tags.map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
        {data.title || 'Sem título'}
      </h1>

      <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
        {data.authorPhotoUrl ? (
          <img src={data.authorPhotoUrl} alt={data.authorName} className="w-10 h-10 rounded-full ring-2 ring-green-200" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center ring-2 ring-green-200">
            <span className="text-green-700 font-bold">{data.authorName[0]}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 text-sm">{data.authorName}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatDate(today)}</span>
          </div>
        </div>
      </div>

      {data.coverImageUrl && (
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 shadow-sm">
          <img src={data.coverImageUrl} alt={data.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className="prose prose-lg prose-green max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-green-500 prose-blockquote:text-gray-600 prose-img:rounded-xl prose-img:shadow-sm"
        dangerouslySetInnerHTML={{ __html: data.content || '<p class="text-gray-400">Sem conteúdo ainda.</p>' }}
      />
    </article>
  )
}
