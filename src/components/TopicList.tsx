import Link from 'next/link'
import type { Topic } from '@/types'

interface TopicListProps {
  topics: Topic[]
  activeTopic?: string
}

const topicIcons: Record<string, string> = {
  default: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
}

export default function TopicList({ topics, activeTopic }: TopicListProps) {
  if (!topics.length) return null

  return (
    <div id="topicos" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Tópicos
      </h3>
      <ul className="space-y-1">
        {topics.map((topic) => {
          const isActive = activeTopic === topic.slug
          return (
            <li key={topic.id}>
              <Link
                href={`/topicos/${topic.slug}`}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${
                  isActive
                    ? 'bg-green-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg
                    className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-green-200' : 'text-green-500 group-hover:text-green-600'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={topicIcons.default} />
                  </svg>
                  <span>{topic.name}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-green-500 text-green-100' : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'
                }`}>
                  {topic.postCount}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
