// Server-side Firestore reads via REST API.
// The Firebase Client SDK uses gRPC/WebChannel which breaks in Node.js (SSR).
// The REST API uses plain fetch — works anywhere, follows the same security rules.
import type { Post, Topic, Tag, Sponsor } from '@/types'
import { slugify } from '@/lib/utils'

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`

type FVal =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { timestampValue: string }
  | { arrayValue: { values?: FVal[] } }
  | { mapValue: { fields: Record<string, FVal> } }
  | { nullValue: string }

function parse(v: FVal): unknown {
  if ('stringValue' in v) return v.stringValue
  if ('booleanValue' in v) return v.booleanValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('timestampValue' in v) return new Date(v.timestampValue)
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(parse)
  if ('mapValue' in v) return parseFields(v.mapValue.fields)
  return null
}

function parseFields(fields: Record<string, FVal>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, parse(v)]))
}

function extractId(name: string): string {
  return name.split('/').pop()!
}

interface RawDoc {
  name: string
  fields?: Record<string, FVal>
}

async function listCollection(col: string): Promise<RawDoc[]> {
  const res = await fetch(`${BASE}/${col}?pageSize=300`, { next: { revalidate: 60 } })
  if (!res.ok) return []
  const json = await res.json()
  return (json.documents ?? []) as RawDoc[]
}

function docToPost(doc: RawDoc): Post {
  const f = parseFields(doc.fields ?? {}) as Record<string, unknown>
  return {
    id: extractId(doc.name),
    title: (f.title as string) || '',
    slug: (f.slug as string) || '',
    content: (f.content as string) || '',
    excerpt: (f.excerpt as string) || '',
    coverImageUrl: f.coverImageUrl as string | undefined,
    topic: (f.topic as string) || '',
    tags: (f.tags as string[]) || [],
    authorId: (f.authorId as string) || '',
    authorName: (f.authorName as string) || '',
    authorPhotoUrl: f.authorPhotoUrl as string | undefined,
    createdAt: (f.createdAt as Date) || new Date(),
    updatedAt: (f.updatedAt as Date) || new Date(),
    published: (f.published as boolean) ?? false,
    readTime: (f.readTime as number) || 1,
    featured: (f.featured as boolean) || false,
    sponsored: (f.sponsored as boolean) || false,
    sponsoredBy: f.sponsoredBy as string | undefined,
  }
}

export async function getPosts(publishedOnly = true): Promise<Post[]> {
  const docs = await listCollection('posts')
  const posts = docs.map(docToPost).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  return publishedOnly ? posts.filter((p) => p.published) : posts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const docs = await listCollection('posts')
  const doc = docs.find((d) => {
    const f = d.fields ?? {}
    return 'slug' in f && parse(f.slug as FVal) === slug
  })
  return doc ? docToPost(doc) : null
}

export async function getPostsByTopic(topicSlug: string): Promise<Post[]> {
  const docs = await listCollection('posts')
  return docs
    .map(docToPost)
    // posts store topic as a name (e.g. "Nutrição"), URL uses the slug — compare slugified
    .filter((p) => slugify(p.topic) === topicSlug && p.published)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const docs = await listCollection('posts')
  return docs
    .map(docToPost)
    // tags in posts may have accents/spaces (pre-fix data); compare slugified
    .filter((p) => p.tags.some((t) => slugify(t) === tag) && p.published)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getTopics(): Promise<Topic[]> {
  const [topicDocs, postDocs] = await Promise.all([
    listCollection('topics'),
    listCollection('posts'),
  ])
  const publishedPosts = postDocs.map(docToPost).filter((p) => p.published)

  // compute real counts from actual published posts
  const counts: Record<string, number> = {}
  for (const p of publishedPosts) {
    const key = slugify(p.topic)
    counts[key] = (counts[key] || 0) + 1
  }

  return topicDocs.map((doc) => {
    const f = parseFields(doc.fields ?? {}) as Record<string, unknown>
    const slug = (f.slug as string) || ''
    return {
      id: extractId(doc.name),
      name: (f.name as string) || '',
      slug,
      description: (f.description as string) || '',
      postCount: counts[slug] || 0,
    }
  })
}

export async function getTags(): Promise<Tag[]> {
  const [tagDocs, postDocs] = await Promise.all([
    listCollection('tags'),
    listCollection('posts'),
  ])
  const publishedPosts = postDocs.map(docToPost).filter((p) => p.published)

  // compute real counts from actual published posts
  const counts: Record<string, number> = {}
  for (const p of publishedPosts) {
    for (const t of p.tags) {
      const key = slugify(t)
      counts[key] = (counts[key] || 0) + 1
    }
  }

  return tagDocs
    .map((doc) => {
      const f = parseFields(doc.fields ?? {}) as Record<string, unknown>
      const slug = (f.slug as string) || ''
      return {
        id: extractId(doc.name),
        name: (f.name as string) || '',
        slug,
        postCount: counts[slug] || 0,
      }
    })
    .filter((t) => t.postCount > 0)
    .sort((a, b) => b.postCount - a.postCount)
}

export async function getSponsors(): Promise<Sponsor[]> {
  const docs = await listCollection('sponsors')
  return docs.map((doc) => {
    const f = parseFields(doc.fields ?? {}) as Record<string, unknown>
    return {
      id: extractId(doc.name),
      name: (f.name as string) || '',
    }
  })
}
