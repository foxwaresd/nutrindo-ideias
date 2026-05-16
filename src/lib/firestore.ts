import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  increment,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'

import type { Post, Topic, Tag, Sponsor, PostStats, Comment, PostInput } from '@/types'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function toPost(id: string, data: Record<string, unknown>): Post {
  return {
    id,
    title: data.title as string,
    slug: data.slug as string,
    content: data.content as string,
    excerpt: data.excerpt as string,
    coverImageUrl: data.coverImageUrl as string | undefined,
    topic: data.topic as string,
    tags: (data.tags as string[]) || [],
    authorId: data.authorId as string,
    authorName: data.authorName as string,
    authorPhotoUrl: data.authorPhotoUrl as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    published: data.published as boolean,
    readTime: data.readTime as number || 1,
    featured: (data.featured as boolean) || false,
    sponsored: (data.sponsored as boolean) || false,
    sponsoredBy: data.sponsoredBy as string | undefined,
  }
}

// Posts
export async function getPosts(publishedOnly = true): Promise<Post[]> {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  const posts = snap.docs.map((d) => toPost(d.id, d.data()))
  return publishedOnly ? posts.filter((p) => p.published) : posts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(collection(db, 'posts'), where('slug', '==', slug), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return toPost(d.id, d.data())
}

export async function getPostById(id: string): Promise<Post | null> {
  const ref = doc(db, 'posts', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return toPost(snap.id, snap.data())
}

export async function getPostsByTopic(topicSlug: string): Promise<Post[]> {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => toPost(d.id, d.data()))
    .filter((p) => p.topic === topicSlug && p.published)
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => toPost(d.id, d.data()))
    .filter((p) => p.tags.includes(tag) && p.published)
}

export async function createPost(input: PostInput): Promise<string> {
  const slug = input.slug || slugify(input.title)
  const readTime = estimateReadTime(input.content)
  const ref = await addDoc(collection(db, 'posts'), {
    ...input,
    slug,
    readTime,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  syncTagsAndTopics(input.tags, input.topic).catch(console.error)
  return ref.id
}

export async function updatePost(id: string, input: Partial<PostInput>): Promise<void> {
  const ref = doc(db, 'posts', id)
  const readTime = input.content ? estimateReadTime(input.content) : undefined
  await updateDoc(ref, {
    ...input,
    ...(readTime ? { readTime } : {}),
    updatedAt: serverTimestamp(),
  })
  if (input.tags || input.topic) {
    syncTagsAndTopics(input.tags || [], input.topic || '').catch(console.error)
  }
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, 'posts', id))
}

// Topics
export async function getTopics(): Promise<Topic[]> {
  const snap = await getDocs(collection(db, 'topics'))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Topic, 'id'>) }))
}

export async function createTopic(name: string): Promise<string> {
  const slug = slugify(name)
  const ref = doc(db, 'topics', slug)
  await setDoc(ref, { name, slug, description: '', postCount: 0 }, { merge: true })
  return slug
}

// Tags
export async function getTags(): Promise<Tag[]> {
  const q = query(collection(db, 'tags'), orderBy('postCount', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Tag, 'id'>) }))
}

async function syncTagsAndTopics(tags: string[], topic: string): Promise<void> {
  if (topic) {
    const topicSlug = slugify(topic)
    const topicRef = doc(db, 'topics', topicSlug)
    await setDoc(topicRef, { name: topic, slug: topicSlug, description: '', postCount: increment(1) }, { merge: true })
  }
  for (const tag of tags) {
    const tagSlug = slugify(tag)
    const tagRef = doc(db, 'tags', tagSlug)
    await setDoc(tagRef, { name: tag, slug: tagSlug, postCount: increment(1) }, { merge: true })
  }
}

// Sponsors
export async function getSponsors(): Promise<Sponsor[]> {
  const snap = await getDocs(collection(db, 'sponsors'))
  return snap.docs.map((d) => ({ id: d.id, name: d.data().name as string }))
}

export async function createSponsor(name: string): Promise<string> {
  const ref = doc(db, 'sponsors', slugify(name))
  await setDoc(ref, { name }, { merge: true })
  return name
}

// Post stats (views, likes, ratings) — stored in post_stats/{postId}
export async function getPostStats(postId: string): Promise<PostStats> {
  const ref = doc(db, 'post_stats', postId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return { viewCount: 0, likeCount: 0, ratingTotal: 0, ratingCount: 0, shareCount: 0 }
  const d = snap.data()
  return {
    viewCount: (d.viewCount as number) || 0,
    likeCount: (d.likeCount as number) || 0,
    ratingTotal: (d.ratingTotal as number) || 0,
    ratingCount: (d.ratingCount as number) || 0,
    shareCount: (d.shareCount as number) || 0,
  }
}

export async function getAllPostStats(): Promise<Record<string, PostStats>> {
  const snap = await getDocs(collection(db, 'post_stats'))
  const result: Record<string, PostStats> = {}
  snap.docs.forEach((d) => {
    const data = d.data()
    result[d.id] = {
      viewCount: (data.viewCount as number) || 0,
      likeCount: (data.likeCount as number) || 0,
      ratingTotal: (data.ratingTotal as number) || 0,
      ratingCount: (data.ratingCount as number) || 0,
      shareCount: (data.shareCount as number) || 0,
    }
  })
  return result
}

export async function getCommentCountsByPost(): Promise<Record<string, number>> {
  const snap = await getDocs(collection(db, 'comments'))
  const counts: Record<string, number> = {}
  snap.docs.forEach((d) => {
    const postId = d.data().postId as string
    counts[postId] = (counts[postId] || 0) + 1
  })
  return counts
}

export async function trackVisit(): Promise<void> {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem('site_visit_tracked')) return
  sessionStorage.setItem('site_visit_tracked', '1')
  const today = new Date().toISOString().split('T')[0]
  const ref = doc(db, 'site_visits', today)
  await setDoc(ref, { count: increment(1), date: today }, { merge: true })
}

export async function getSiteVisits(days: number): Promise<{ date: string; count: number }[]> {
  const dates: string[] = []
  const now = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  const snaps = await Promise.all(dates.map((date) => getDoc(doc(db, 'site_visits', date))))
  return snaps
    .map((snap, i) => ({ date: dates[i], count: snap.exists() ? ((snap.data().count as number) || 0) : 0 }))
    .reverse()
}

export async function incrementView(postId: string): Promise<void> {
  const ref = doc(db, 'post_stats', postId)
  await setDoc(ref, { viewCount: increment(1) }, { merge: true })
}

export async function toggleLike(postId: string, delta: 1 | -1): Promise<void> {
  const ref = doc(db, 'post_stats', postId)
  await setDoc(ref, { likeCount: increment(delta) }, { merge: true })
}

export async function addRating(postId: string, stars: number): Promise<void> {
  const ref = doc(db, 'post_stats', postId)
  await setDoc(ref, { ratingTotal: increment(stars), ratingCount: increment(1) }, { merge: true })
}

export async function incrementShare(postId: string): Promise<void> {
  const ref = doc(db, 'post_stats', postId)
  await setDoc(ref, { shareCount: increment(1) }, { merge: true })
}

// Comments
export async function getComments(postId: string): Promise<Comment[]> {
  const q = query(collection(db, 'comments'), where('postId', '==', postId))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => {
      const data = d.data()
      return {
        id: d.id,
        postId: data.postId as string,
        authorName: data.authorName as string,
        content: data.content as string,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        adminReply: data.adminReply as string | undefined,
        adminReplyAt: (data.adminReplyAt as Timestamp)?.toDate() || undefined,
      }
    })
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

export async function addComment(postId: string, authorName: string, content: string): Promise<void> {
  await addDoc(collection(db, 'comments'), {
    postId,
    authorName: authorName.trim(),
    content: content.trim(),
    createdAt: serverTimestamp(),
  })
}

export async function deleteComment(commentId: string): Promise<void> {
  await deleteDoc(doc(db, 'comments', commentId))
}

export async function replyToComment(commentId: string, reply: string): Promise<void> {
  await updateDoc(doc(db, 'comments', commentId), {
    adminReply: reply.trim(),
    adminReplyAt: serverTimestamp(),
  })
}

// Admin check
export async function isAdmin(uid: string): Promise<boolean> {
  const ref = doc(db, 'admins', uid)
  const snap = await getDoc(ref)
  return snap.exists()
}
