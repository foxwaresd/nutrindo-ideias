'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/firestore'
import PostForm from '@/components/PostForm'
import type { Post } from '@/types'

export default function EditarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [post, setPost] = useState<Post | null | undefined>(undefined)

  useEffect(() => {
    getPostById(id).then(setPost)
  }, [id])

  if (post === undefined) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) notFound()

  return <PostForm post={post} />
}
