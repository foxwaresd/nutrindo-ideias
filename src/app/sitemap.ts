import type { MetadataRoute } from 'next'
import { getPosts, getTopics, getTags } from '@/lib/firestore-rest'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nutrandoideias.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, topics, tags] = await Promise.all([
    getPosts(true),
    getTopics(),
    getTags(),
  ])

  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const topicUrls = topics.map((topic) => ({
    url: `${BASE_URL}/topicos/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const tagUrls = tags.map((tag) => ({
    url: `${BASE_URL}/tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
    ...topicUrls,
    ...tagUrls,
  ]
}
