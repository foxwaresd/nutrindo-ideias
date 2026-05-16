'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createPost, updatePost, getTopics, getTags, createTopic, getSponsors, createSponsor } from '@/lib/firestore'
import { uploadCoverImage } from '@/lib/storage'
import { slugify } from '@/lib/utils'
import RichTextEditor from './RichTextEditor'
import ImageUpload from './ImageUpload'
import type { Post, Topic, Tag, Sponsor } from '@/types'

interface PostFormProps {
  post?: Post
}

export default function PostForm({ post }: PostFormProps) {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [topic, setTopic] = useState(post?.topic || '')
  const [newTopic, setNewTopic] = useState('')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [published, setPublished] = useState(post?.published ?? false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | undefined>(post?.coverImageUrl)
  const [featured, setFeatured] = useState(post?.featured ?? false)
  const [sponsored, setSponsored] = useState(post?.sponsored ?? false)
  const [sponsoredBy, setSponsoredBy] = useState(post?.sponsoredBy || '')
  const [newSponsor, setNewSponsor] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [existingTags, setExistingTags] = useState<Tag[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [autoSlug, setAutoSlug] = useState(!post)

  useEffect(() => {
    getTopics().then(setTopics)
    getTags().then(setExistingTags)
    getSponsors().then(setSponsors)
  }, [])

  useEffect(() => {
    if (autoSlug) setSlug(slugify(title))
  }, [title, autoSlug])

  function addTag() {
    const incoming = tagInput.split(',').map((t) => slugify(t.trim())).filter(Boolean)
    const next = incoming.filter((t) => !tags.includes(t))
    if (next.length) setTags([...tags, ...next])
    setTagInput('')
  }

  function addExistingTag(tag: string) {
    if (!tags.includes(tag)) setTags([...tags, tag])
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  async function handleSave(asDraft = false) {
    if (!title.trim()) return setError('O título é obrigatório.')
    if (!asDraft) {
      if (!content.trim() || content === '<p></p>') return setError('O conteúdo é obrigatório.')
      if (!topic && !newTopic) return setError('Selecione ou crie um tópico.')
    }
    setError('')
    setSaving(true)

    try {
      let finalCoverUrl = coverUrl

      if (coverFile) {
        finalCoverUrl = await uploadCoverImage(coverFile, slugify(title))
      }

      let finalTopic = topic
      if (newTopic.trim()) {
        finalTopic = newTopic.trim()
        await createTopic(finalTopic)
      }

      const finalSponsor = newSponsor.trim() || sponsoredBy
      if (newSponsor.trim()) await createSponsor(newSponsor.trim())

      const payload = {
        title: title.trim(),
        slug: slug || slugify(title),
        content,
        excerpt: excerpt.trim() || title.trim(),
        ...(finalCoverUrl ? { coverImageUrl: finalCoverUrl } : {}),
        topic: finalTopic,
        tags,
        authorId: user!.uid,
        authorName: user!.displayName || 'Admin',
        ...(user!.photoURL ? { authorPhotoUrl: user!.photoURL } : {}),
        published: !asDraft,
        ...(featured ? { featured: true } : {}),
        ...(sponsored && finalSponsor ? { sponsored: true, sponsoredBy: finalSponsor } : {}),
      }

      if (post) {
        await updatePost(post.id, payload)
      } else {
        await createPost(payload)
      }

      router.push('/admin')
    } catch (err) {
      setError('Erro ao salvar. Tente novamente.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {post ? 'Editar Post' : 'Novo Post'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem('post-preview', JSON.stringify({
                title,
                content,
                excerpt,
                topic: newTopic || topic,
                tags,
                authorName: user?.displayName || 'Admin',
                authorPhotoUrl: user?.photoURL || undefined,
                coverImageUrl: coverUrl,
                featured,
                sponsored,
                sponsoredBy: newSponsor.trim() || sponsoredBy,
              }))
              window.open('/admin/preview', '_blank')
            }}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Pré-visualizar
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Salvar rascunho
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm disabled:opacity-40"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {post ? 'Atualizar' : 'Publicar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Um título incrível para o seu post"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-lg font-semibold"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            URL do post
            <span className="font-normal text-gray-400 ml-2 text-xs">/posts/{slug || '...'}</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setAutoSlug(false) }}
              placeholder="url-do-post"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 text-sm font-mono"
            />
            <button
              type="button"
              onClick={() => { setSlug(slugify(title)); setAutoSlug(true) }}
              className="px-3 py-2 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Auto
            </button>
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Imagem de capa
            <span className="font-normal text-gray-400 ml-2 text-xs">opcional</span>
          </label>
          <ImageUpload
            value={coverUrl}
            onChange={setCoverUrl}
            onFile={setCoverFile}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Resumo
            <span className="font-normal text-gray-400 ml-2 text-xs">Exibido na listagem de posts</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Um breve resumo do que o post trata..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 text-sm resize-none"
          />
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tópico *</label>
          <div className="flex gap-3">
            <select
              value={topic}
              onChange={(e) => { setTopic(e.target.value); setNewTopic('') }}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 text-sm bg-white"
            >
              <option value="">Selecionar tópico existente</option>
              {topics.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
            <span className="flex items-center text-gray-400 text-sm">ou</span>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => { setNewTopic(e.target.value); setTopic('') }}
              placeholder="Criar novo tópico"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 text-sm"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>

          {/* Selected tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="nutrição, saúde, receitas — separe por vírgula"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 text-sm"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-xl transition-colors"
            >
              Adicionar
            </button>
          </div>

          {/* Existing tags as suggestions */}
          {existingTags.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Tags usadas anteriormente:</p>
              <div className="flex flex-wrap gap-1.5">
                {existingTags
                  .filter((t) => !tags.includes(t.slug))
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => addExistingTag(t.slug)}
                      className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all"
                    >
                      + #{t.slug}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Content editor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Conteúdo *</label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Escreva seu conteúdo aqui..."
          />
        </div>

        {/* Featured toggle */}
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Post em destaque</p>
            <p className="text-xs text-gray-500 mt-0.5">{featured ? 'Aparece na seção de destaques' : 'Post normal'}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeatured(!featured)}
            className={`relative inline-flex w-12 h-6 rounded-full transition-colors ${featured ? 'bg-amber-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${featured ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Sponsored toggle */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Post patrocinado</p>
              <p className="text-xs text-gray-500 mt-0.5">{sponsored ? 'Exibe badge de patrocinador' : 'Sem patrocínio'}</p>
            </div>
            <button
              type="button"
              onClick={() => setSponsored(!sponsored)}
              className={`relative inline-flex w-12 h-6 rounded-full transition-colors ${sponsored ? 'bg-orange-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${sponsored ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {sponsored && (
            <div className="flex gap-3">
              <select
                value={sponsoredBy}
                onChange={(e) => { setSponsoredBy(e.target.value); setNewSponsor('') }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 text-sm bg-white"
              >
                <option value="">Selecionar patrocinador</option>
                {sponsors.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <span className="flex items-center text-gray-400 text-sm">ou</span>
              <input
                type="text"
                value={newSponsor}
                onChange={(e) => { setNewSponsor(e.target.value); setSponsoredBy('') }}
                placeholder="Novo patrocinador"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 text-sm"
              />
            </div>
          )}
        </div>

        {/* Publish toggle */}
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Visibilidade</p>
            <p className="text-xs text-gray-500 mt-0.5">{published ? 'Post visível para todos' : 'Somente rascunho'}</p>
          </div>
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`relative inline-flex w-12 h-6 rounded-full transition-colors ${published ? 'bg-green-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
