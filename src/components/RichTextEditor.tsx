'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style/text-style'
import { Color } from '@tiptap/extension-color'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extension-placeholder'
import { uploadInlineImage } from '@/lib/storage'
import { useCallback, useRef } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

const COLORS = ['#000000', '#374151', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']
const HIGHLIGHTS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fce7f3', '#fed7aa']

function ToolbarButton({ onClick, active, title, children }: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true }),
      Placeholder.configure({ placeholder: placeholder || 'Escreva seu conteúdo aqui...' }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL do link:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !e.target.files?.[0]) return
    const file = e.target.files[0]
    try {
      const url = await uploadInlineImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      alert('Erro ao fazer upload da imagem.')
    }
    e.target.value = ''
  }

  if (!editor) return null

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">
        {/* History */}
        <div className="flex gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Refazer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-gray-300" />

        {/* Headings */}
        <div className="flex gap-0.5">
          {([1, 2, 3] as const).map((level) => (
            <ToolbarButton
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              active={editor.isActive('heading', { level })}
              title={`Título ${level}`}
            >
              <span className="font-bold text-xs">H{level}</span>
            </ToolbarButton>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-300" />

        {/* Text formatting */}
        <div className="flex gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito">
            <span className="font-bold text-xs">B</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico">
            <span className="italic text-xs">I</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Sublinhado">
            <span className="underline text-xs">U</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado">
            <span className="line-through text-xs">S</span>
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-gray-300" />

        {/* Lists */}
        <div className="flex gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista com marcadores">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h10M7 17h10M3 7h.01M3 12h.01M3 17h.01" /></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citação">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Código">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-gray-300" />

        {/* Alignment */}
        <div className="flex gap-0.5">
          {(['left', 'center', 'right'] as const).map((align) => (
            <ToolbarButton
              key={align}
              onClick={() => editor.chain().focus().setTextAlign(align).run()}
              active={editor.isActive({ textAlign: align })}
              title={`Alinhar ${align === 'left' ? 'à esquerda' : align === 'center' ? 'ao centro' : 'à direita'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {align === 'left' && <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h10M4 14h16M4 18h10" />}
                {align === 'center' && <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 10h10M4 14h16M7 18h10" />}
                {align === 'right' && <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M10 10h10M4 14h16M10 18h10" />}
              </svg>
            </ToolbarButton>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-300" />

        {/* Colors */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">Cor:</span>
          <div className="flex gap-0.5">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => editor.chain().focus().setColor(color).run()}
                title={color}
                className="w-4 h-4 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">Marca:</span>
          <div className="flex gap-0.5">
            {HIGHLIGHTS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                title={color}
                className="w-4 h-4 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              title="Remover destaque"
              className="w-4 h-4 rounded border border-gray-300 text-gray-400 text-xs flex items-center justify-center hover:scale-110 transition-transform"
            >×</button>
          </div>
        </div>

        <div className="w-px h-5 bg-gray-300" />

        {/* Link & Image */}
        <div className="flex gap-0.5">
          <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Inserir link">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Inserir imagem">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </ToolbarButton>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      <EditorContent
        editor={editor}
        className="prose prose-green max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-64 [&_.ProseMirror]:p-4"
      />
    </div>
  )
}
