import type { Metadata } from 'next'
import { getPosts, getTopics, getTags } from '@/lib/firestore-rest'
import PostCard from '@/components/PostCard'
import PostList from '@/components/PostList'
import Sidebar from '@/components/Sidebar'
import CurrentDateTime from '@/components/CurrentDateTime'

export const metadata: Metadata = {
  title: 'Ciências da Nutrição',
  description: 'Blog sobre nutrição baseado em ciência. Dicas práticas e conhecimento nutricional para uma alimentação saudável e equilibrada.',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [posts, topics, tags] = await Promise.all([
    getPosts(true).catch(() => []),
    getTopics().catch(() => []),
    getTags().catch(() => []),
  ])

  const featured = posts.filter((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="mb-12 text-center bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl py-16 px-8 shadow-sm">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
          Ciências da <span className="text-green-200">Nutrição</span>
        </h1>
        <p className="text-sm text-green-100 max-w-2xl mx-auto">
          <CurrentDateTime />
        </p>
      </section>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-lg font-medium">Nenhum artigo publicado ainda.</p>
          <p className="text-sm mt-1">Em breve, conteúdo fresquinho sobre nutrição!</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1 min-w-0">
            {featured.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Destaques
                </h2>
                <div className={`grid gap-5 ${featured.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1 max-w-lg'}`}>
                  {featured.map((post) => (
                    <PostCard key={post.id} post={post} featured />
                  ))}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="block w-6 h-0.5 bg-green-600" />
                  {featured.length > 0 ? 'Mais recentes' : 'Artigos'}
                </h2>
                <PostList posts={rest} />
              </section>
            )}
          </main>

          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <Sidebar topics={topics} tags={tags} />
          </div>
        </div>
      )}
    </div>
  )
}
