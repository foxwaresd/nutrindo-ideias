import Link from 'next/link'
import type { Tag } from '@/types'

interface TagCloudProps {
  tags: Tag[]
  activeTag?: string
}

const tagColors = [
  'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
  'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100',
  'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
]

export default function TagCloud({ tags, activeTag }: TagCloudProps) {
  if (!tags.length) return null

  return (
    <div id="tags" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => {
          const colorClass = activeTag === tag.slug
            ? 'bg-green-600 text-white border-green-600'
            : tagColors[i % tagColors.length]
          return (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${colorClass}`}
            >
              <span>{tag.name}</span>
              <span className="opacity-60">({tag.postCount})</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
