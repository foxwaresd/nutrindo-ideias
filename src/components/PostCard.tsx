import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types'
import { formatDate, truncate, slugify } from '@/lib/utils'

interface PostCardProps {
  post: Post
  featured?: boolean
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link href={`/posts/${post.slug}`} className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
        {post.coverImageUrl && (
          <div className="relative h-56 sm:h-72 overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <Link href={`/topicos/${slugify(post.topic)}`} className="absolute bottom-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide hover:bg-green-700 transition-colors">
              {post.topic}
            </Link>
          </div>
        )}
        <div className="p-6">
          {!post.coverImageUrl && (
            <Link href={`/topicos/${slugify(post.topic)}`} className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3 hover:bg-green-200 transition-colors">
              {post.topic}
            </Link>
          )}
          {post.sponsored && post.sponsoredBy && (
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 ml-2">
              Patrocinado por: {post.sponsoredBy}
            </span>
          )}
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-snug mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {truncate(post.excerpt || post.content, 160)}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.authorPhotoUrl ? (
                <img src={post.authorPhotoUrl} alt={post.authorName} className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-700 text-xs font-bold">{post.authorName[0]}</span>
                </div>
              )}
              <span className="text-xs text-gray-500">{post.authorName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              <span>{post.readTime} min</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/posts/${post.slug}`} className="group flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
      {post.coverImageUrl && (
        <div className="relative w-24 h-24 sm:w-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="128px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <Link href={`/topicos/${slugify(post.topic)}`} className="text-xs font-semibold text-green-600 uppercase tracking-wide hover:text-green-800 transition-colors">
            {post.topic}
          </Link>
          {post.sponsored && post.sponsoredBy && (
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              Patrocinado por: {post.sponsoredBy}
            </span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-snug mt-0.5 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {truncate(post.excerpt || post.content, 120)}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span>{formatDate(post.createdAt)}</span>
          <span>·</span>
          <span>{post.readTime} min de leitura</span>
        </div>
      </div>
    </Link>
  )
}
