'use client'

import { useState } from 'react'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ToolButtonProps = {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToolButton({ label, active, disabled, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // keep the editor selection when a toolbar button is pressed
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 [&_svg]:size-4',
        active && 'bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary',
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [href, setHref] = useState('')

  const openLink = () => {
    setHref(editor.getAttributes('link').href ?? '')
    setLinkOpen(true)
  }
  const applyLink = () => {
    const url = href.trim()
    if (!url) editor.chain().focus().unsetLink().run()
    else
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: /^(https?:|mailto:)/i.test(url) ? url : `https://${url}` })
        .run()
    setLinkOpen(false)
  }

  return (
    <div className="border-b border-border">
      <div role="toolbar" aria-label="Text formatting" className="flex flex-wrap gap-0.5 p-1.5">
        <ToolButton
          label="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolButton>
        <ToolButton
          label="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolButton>
        <ToolButton
          label="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline />
        </ToolButton>
        <ToolButton
          label="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough />
        </ToolButton>
        <span aria-hidden className="mx-1 my-1.5 w-px bg-border" />
        <ToolButton
          label="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolButton>
        <ToolButton
          label="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolButton>
        <ToolButton
          label="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </ToolButton>
        <span aria-hidden className="mx-1 my-1.5 w-px bg-border" />
        <ToolButton label="Add link" active={editor.isActive('link')} onClick={openLink}>
          <Link2 />
        </ToolButton>
        <ToolButton
          label="Remove link"
          disabled={!editor.isActive('link')}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink />
        </ToolButton>
        <span aria-hidden className="mx-1 my-1.5 w-px bg-border" />
        <ToolButton
          label="Clear formatting"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <RemoveFormatting />
        </ToolButton>
        <ToolButton
          label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 />
        </ToolButton>
        <ToolButton
          label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 />
        </ToolButton>
      </div>
      {linkOpen && (
        <div className="flex gap-2 border-t border-border p-2">
          <input
            autoFocus
            value={href}
            onChange={(e) => setHref(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyLink()
              }
              if (e.key === 'Escape') setLinkOpen(false)
            }}
            placeholder="https://example.com"
            aria-label="Link address"
            className="h-9 min-w-0 flex-1 rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring"
          />
          <button
            type="button"
            onClick={applyLink}
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  id?: string
}

/** TipTap rich-text editor styled with the admin theme. Emits HTML (sanitised again on the server). */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Describe the dish…',
  id,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: { openOnClick: false },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
    editorProps: {
      attributes: {
        id: id ?? '',
        role: 'textbox',
        'aria-multiline': 'true',
        class: cn(
          'min-h-28 px-3 py-2.5 text-sm leading-6 outline-none',
          '[&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5',
          '[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
          '[&_a]:text-primary [&_a]:underline',
          '[&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:text-muted-foreground [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
        ),
      },
    },
  })

  return (
    <div className="overflow-hidden rounded-lg border border-input bg-card focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40">
      {editor ? <Toolbar editor={editor} /> : <div className="h-[49px] border-b border-border" />}
      <EditorContent editor={editor} />
    </div>
  )
}
