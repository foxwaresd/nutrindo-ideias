'use client'

import { useEffect, useState } from 'react'
import { getPostStats, incrementView, toggleLike, addRating } from '@/lib/firestore'
import type { PostStats } from '@/types'

interface Props {
  postId: string
}

export default function PostInteractions({ postId }: Props) {
  const [stats, setStats] = useState<PostStats>({ viewCount: 0, likeCount: 0, ratingTotal: 0, ratingCount: 0 })
  const [liked, setLiked] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(true)

  const viewKey = `viewed_${postId}`
  const likeKey = `liked_${postId}`
  const ratingKey = `rated_${postId}`

  useEffect(() => {
    async function init() {
      const data = await getPostStats(postId)
      setStats(data)
      setLiked(!!localStorage.getItem(likeKey))
      const savedRating = localStorage.getItem(ratingKey)
      if (savedRating) setUserRating(Number(savedRating))

      if (!sessionStorage.getItem(viewKey)) {
        sessionStorage.setItem(viewKey, '1')
        await incrementView(postId)
        setStats((s) => ({ ...s, viewCount: s.viewCount + 1 }))
      }
      setLoading(false)
    }
    init()
  }, [postId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLike() {
    const next = !liked
    setLiked(next)
    setStats((s) => ({ ...s, likeCount: s.likeCount + (next ? 1 : -1) }))
    if (next) localStorage.setItem(likeKey, '1')
    else localStorage.removeItem(likeKey)
    await toggleLike(postId, next ? 1 : -1)
  }

  async function handleRate(stars: number) {
    if (userRating) return
    setUserRating(stars)
    localStorage.setItem(ratingKey, String(stars))
    setStats((s) => ({ ...s, ratingTotal: s.ratingTotal + stars, ratingCount: s.ratingCount + 1 }))
    await addRating(postId, stars)
  }

  const avg = stats.ratingCount > 0 ? stats.ratingTotal / stats.ratingCount : 0

  if (loading) return <div className="h-20 animate-pulse bg-gray-50 rounded-2xl" />

  return (
    <div className="border border-gray-100 rounded-2xl bg-gray-50 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-6">

      {/* Views */}
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{stats.viewCount.toLocaleString('pt-BR')} visualizações</span>
      </div>

      {/* Like */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          liked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
        }`}
      >
        <svg
          className="w-5 h-5 transition-transform active:scale-125"
          fill={liked ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>{stats.likeCount} {stats.likeCount === 1 ? 'curtida' : 'curtidas'}</span>
      </button>

      {/* Divider */}
      <div className="hidden sm:block w-px h-8 bg-gray-200" />

      {/* Star rating */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={!!userRating}
              onClick={() => handleRate(star)}
              onMouseEnter={() => !userRating && setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`transition-transform ${!userRating ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
            >
              <svg
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || userRating || Math.round(avg))
                    ? 'text-amber-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          {userRating
            ? `Você avaliou com ${userRating} estrela${userRating > 1 ? 's' : ''}`
            : stats.ratingCount > 0
            ? `Média ${avg.toFixed(1)} (${stats.ratingCount} avaliação${stats.ratingCount > 1 ? 'ões' : ''})`
            : 'Avalie este artigo'}
        </p>
      </div>
    </div>
  )
}
