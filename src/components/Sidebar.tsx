import type { Topic, Tag } from '@/types'
import TopicList from './TopicList'
import TagCloud from './TagCloud'

interface SidebarProps {
  topics: Topic[]
  tags: Tag[]
  activeTopic?: string
  activeTag?: string
}

export default function Sidebar({ topics, tags, activeTopic, activeTag }: SidebarProps) {
  return (
    <aside className="space-y-6">
      <TopicList topics={topics} activeTopic={activeTopic} />
      <TagCloud tags={tags} activeTag={activeTag} />

      {/* About widget */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V13M12 13C12 9 9 6 5 6C5 10 8 13 12 13ZM12 13C12 9 15 6 19 6C19 10 16 13 12 13Z" />
          </svg>
        </div>
        <h3 className="font-bold text-lg mb-1">Ciências da Nutrição</h3>
        <p className="text-green-100 text-sm leading-relaxed">
          Blog sobre nutrição baseado em ciência. Dicas práticas e conhecimento nutricional para uma alimentação saudável e equilibrada.
        </p>
      </div>
    </aside>
  )
}
