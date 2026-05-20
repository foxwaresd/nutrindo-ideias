'use client'

import { useState } from 'react'
import PostCard from './PostCard'
import type { Post } from '@/types'

const PAGE_SIZE = 10

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  const slice = posts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  if (posts.length === 0) return null

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {slice.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  i === page
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próxima
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-3">
        {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, posts.length)} de {posts.length} artigos
      </p>
    </div>
  )
}
