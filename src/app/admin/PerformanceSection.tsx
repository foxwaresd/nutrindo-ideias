'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPostStats, getCommentCountsByPost, getSiteVisits } from '@/lib/firestore'
import type { Post, PostStats } from '@/types'

interface PostWithStats extends Post {
  stats: PostStats
  commentCount: number
  engagement: number
}

interface VisitTotals {
  today: number
  month: number
  year: number
}

interface RankingConfig {
  label: string
  icon: React.ReactNode
  items: PostWithStats[]
  getValue: (p: PostWithStats) => string
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}
function HeartIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}
function StarIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}
function ChatIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}
function LinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}
function FireIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  )
}

function RankBadge({ rank }: { rank: number }) {
  const color =
    rank === 1 ? 'bg-amber-400 text-white' :
    rank === 2 ? 'bg-gray-400 text-white' :
    rank === 3 ? 'bg-amber-700 text-white' :
    'bg-gray-100 text-gray-500'
  return (
    <span className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>
      {rank}
    </span>
  )
}

function RankingCard({ config }: { config: RankingConfig }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
        <span className="text-green-600">{config.icon}</span>
        {config.label}
      </h3>
      {config.items.length === 0 ? (
        <p className="text-gray-400 text-sm">Sem dados ainda</p>
      ) : (
        <ol className="space-y-3">
          {config.items.map((post, i) => (
            <li key={post.id} className="flex items-start gap-3">
              <RankBadge rank={i + 1} />
              <div className="min-w-0">
                <Link
                  href={`/posts/${post.slug}`}
                  target="_blank"
                  className="text-sm font-medium text-gray-900 hover:text-green-600 line-clamp-1 transition-colors"
                >
                  {post.title}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{config.getValue(post)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default function PerformanceSection({ posts }: { posts: Post[] }) {
  const [data, setData] = useState<PostWithStats[]>([])
  const [visits, setVisits] = useState<VisitTotals>({ today: 0, month: 0, year: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const published = posts.filter((p) => p.published)
      const [allStats, commentCounts, visitData] = await Promise.all([
        getAllPostStats(),
        getCommentCountsByPost(),
        getSiteVisits(365),
      ])

      const todayStr = new Date().toISOString().split('T')[0]
      const monthStr = todayStr.slice(0, 7)
      const yearStr = todayStr.slice(0, 4)

      setVisits({
        today: visitData.find((v) => v.date === todayStr)?.count ?? 0,
        month: visitData.filter((v) => v.date.startsWith(monthStr)).reduce((s, v) => s + v.count, 0),
        year: visitData.filter((v) => v.date.startsWith(yearStr)).reduce((s, v) => s + v.count, 0),
      })

      const enriched: PostWithStats[] = published.map((post) => {
        const stats = allStats[post.id] ?? { viewCount: 0, likeCount: 0, ratingTotal: 0, ratingCount: 0, shareCount: 0 }
        const commentCount = commentCounts[post.id] ?? 0
        const engagement = stats.viewCount + stats.likeCount * 3 + commentCount * 5 + stats.shareCount * 4
        return { ...post, stats, commentCount, engagement }
      })

      setData(enriched)
      setLoading(false)
    }
    load()
  }, [posts])

  const top5 = (key: (p: PostWithStats) => number) =>
    [...data].sort((a, b) => key(b) - key(a)).slice(0, 5)

  const rankings: RankingConfig[] = [
    {
      label: 'Mais Vistos',
      icon: <EyeIcon />,
      items: top5((p) => p.stats.viewCount),
      getValue: (p) => `${p.stats.viewCount.toLocaleString('pt-BR')} visualizações`,
    },
    {
      label: 'Mais Curtidos',
      icon: <HeartIcon />,
      items: top5((p) => p.stats.likeCount),
      getValue: (p) => `${p.stats.likeCount} curtidas`,
    },
    {
      label: 'Melhor Avaliados',
      icon: <StarIcon />,
      items: top5((p) => (p.stats.ratingCount ? p.stats.ratingTotal / p.stats.ratingCount : 0)),
      getValue: (p) =>
        p.stats.ratingCount
          ? `${(p.stats.ratingTotal / p.stats.ratingCount).toFixed(1)} estrelas (${p.stats.ratingCount} avaliações)`
          : 'Sem avaliações',
    },
    {
      label: 'Mais Comentados',
      icon: <ChatIcon />,
      items: top5((p) => p.commentCount),
      getValue: (p) => `${p.commentCount} comentários`,
    },
    {
      label: 'Mais Compartilhados',
      icon: <LinkIcon />,
      items: top5((p) => p.stats.shareCount),
      getValue: (p) => `${p.stats.shareCount} compartilhamentos`,
    },
    {
      label: 'Mais Engajamento',
      icon: <FireIcon />,
      items: top5((p) => p.engagement),
      getValue: (p) => `Score ${p.engagement.toLocaleString('pt-BR')}`,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Visitor counts */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Visitantes hoje', value: visits.today },
          { label: 'Este mês', value: visits.month },
          { label: 'Este ano', value: visits.year },
        ].map((s) => (
          <div key={s.label} className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 text-white">
            <p className="text-3xl font-extrabold">{s.value.toLocaleString('pt-BR')}</p>
            <p className="text-green-100 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Rankings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rankings.map((r) => (
          <RankingCard key={r.label} config={r} />
        ))}
      </div>
    </div>
  )
}
