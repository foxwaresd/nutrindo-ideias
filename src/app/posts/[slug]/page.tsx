import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug, getPosts } from '@/lib/firestore-rest'
import { formatDate, slugify } from '@/lib/utils'
import CopyLinkButton from '@/components/CopyLinkButton'
import PostInteractions from '@/components/PostInteractions'
import CommentsSection from '@/components/CommentsSection'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post não encontrado' }
  return {
    title: `${post.title} — Ciências da Nutrição`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  const posts = await getPosts(true)
  return posts.map((p) => ({ slug: p.slug }))
}

export const revalidate = 60

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || !post.published) notFound()

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-green-600 transition-colors">Início</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/topicos/${slugify(post.topic)}`} className="hover:text-green-600 transition-colors capitalize">{post.topic}</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
      </nav>

      {/* Topic + Sponsored badge (no tag pills here) */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Link
          href={`/topicos/${slugify(post.topic)}`}
          className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide hover:bg-green-700 transition-colors"
        >
          {post.topic}
        </Link>
        {post.sponsored && post.sponsoredBy && (
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Patrocinado por: {post.sponsoredBy}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
        {post.title}
      </h1>

      {/* Author + meta */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
        {post.authorPhotoUrl ? (
          <img src={post.authorPhotoUrl} alt={post.authorName} className="w-10 h-10 rounded-full ring-2 ring-green-200" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center ring-2 ring-green-200">
            <span className="text-green-700 font-bold">{post.authorName[0]}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 text-sm">{post.authorName}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatDate(post.createdAt)}</span>
            <span>·</span>
            <span>{post.readTime} min de leitura</span>
          </div>
        </div>
      </div>

      {/* Interactions + Share — right below author */}
      <div className="mb-10 space-y-4">
        <PostInteractions postId={post.id} />
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-gray-700">Compartilhar:</p>
          <CopyLinkButton postId={post.id} />
        </div>
      </div>

      {/* Cover image */}
      {post.coverImageUrl && (
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 shadow-sm">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg prose-green max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-green-500 prose-blockquote:text-gray-600 prose-img:rounded-xl prose-img:shadow-sm"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags — before comments */}
      {post.tags.length > 0 && (
        <div className="mt-10 pt-8 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentsSection postId={post.id} />

      {/* Back */}
      <div className="mt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para o início
        </Link>
      </div>
    </article>
  )
}
