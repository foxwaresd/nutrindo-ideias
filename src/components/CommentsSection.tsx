'use client'

import { useEffect, useState } from 'react'
import { getComments, addComment, deleteComment, replyToComment } from '@/lib/firestore'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import type { Comment } from '@/types'

interface Props {
  postId: string
}

export default function CommentsSection({ postId }: Props) {
  const { user, admin } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function load() {
    const data = await getComments(postId)
    setComments(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [postId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return setError('Nome e comentário são obrigatórios.')
    setError('')
    setSubmitting(true)
    try {
      await addComment(postId, name, content)
      setName('')
      setContent('')
      setSuccess('Comentário enviado!')
      setTimeout(() => setSuccess(''), 3000)
      await load()
    } catch {
      setError('Erro ao enviar comentário.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este comentário?')) return
    await deleteComment(id)
    setComments((c) => c.filter((x) => x.id !== id))
  }

  async function handleReply(commentId: string) {
    if (!replyText.trim()) return
    await replyToComment(commentId, replyText)
    setReplyText('')
    setReplyingTo(null)
    await load()
  }

  return (
    <section className="mt-12 pt-10 border-t border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comentários
        {!loading && <span className="text-sm font-normal text-gray-400">({comments.length})</span>}
      </h2>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />)}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm mb-8">Seja o primeiro a comentar!</p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 text-xs font-bold">{c.authorName[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">{c.authorName}</span>
                    <span className="text-gray-400 text-xs ml-2">{formatDate(c.createdAt)}</span>
                  </div>
                </div>
                {admin && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(c.adminReply || '') }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {c.adminReply ? 'Editar resposta' : 'Responder'}
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-700 text-sm mt-2 ml-10">{c.content}</p>

              {/* Admin reply */}
              {c.adminReply && (
                <div className="mt-3 ml-10 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-green-700">Resposta da administração</span>
                    {c.adminReplyAt && <span className="text-xs text-gray-400">· {formatDate(c.adminReplyAt)}</span>}
                  </div>
                  <p className="text-sm text-gray-700">{c.adminReply}</p>
                </div>
              )}

              {/* Reply form (admin only) */}
              {admin && replyingTo === c.id && (
                <div className="mt-3 ml-10 flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    placeholder="Escreva sua resposta..."
                    className="flex-1 px-3 py-2 text-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleReply(c.id)}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Enviar
                    </button>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Deixe seu comentário</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome *"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva seu comentário... *"
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            Publicar comentário
          </button>
        </form>
      </div>
    </section>
  )
}
