export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImageUrl?: string
  topic: string
  tags: string[]
  authorId: string
  authorName: string
  authorPhotoUrl?: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  readTime: number
  featured?: boolean
  sponsored?: boolean
  sponsoredBy?: string
}

export interface Sponsor {
  id: string
  name: string
}

export interface PostStats {
  viewCount: number
  likeCount: number
  ratingTotal: number
  ratingCount: number
  shareCount: number
}

export interface Comment {
  id: string
  postId: string
  authorName: string
  content: string
  createdAt: Date
  adminReply?: string
  adminReplyAt?: Date
}

export interface Topic {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  postCount: number
}

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}

export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'readTime'>
