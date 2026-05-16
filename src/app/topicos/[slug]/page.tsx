import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostsByTopic, getTopics, getTags } from '@/lib/firestore-rest'
import PaginatedPosts from '@/components/PaginatedPosts'
import Sidebar from '@/components/Sidebar'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Tópico: ${slug} — Ciências da Nutrição`,
    description: `Posts sobre ${slug} no Ciências da Nutrição.`,
  }
}

export const revalidate = 60

export default async function TopicPage({ params }: Props) {
  const { slug } = await params
  const [posts, topics, tags] = await Promise.all([
    getPostsByTopic(slug),
    getTopics(),
    getTags(),
  ])

  if (!topics.length && !posts.length) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Início
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Tópico: <span className="text-green-600 capitalize">{slug}</span>
        </h1>
        <p className="text-gray-500 mt-1">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <main className="flex-1 min-w-0">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">Nenhum post neste tópico ainda.</p>
            </div>
          ) : (
            <PaginatedPosts posts={posts} />
          )}
        </main>
        <div className="lg:w-72 xl:w-80 flex-shrink-0">
          <Sidebar topics={topics} tags={tags} activeTopic={slug} />
        </div>
      </div>
    </div>
  )
}
