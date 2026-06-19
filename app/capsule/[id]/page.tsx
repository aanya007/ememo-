'use client'

import { use, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Masonry from 'react-masonry-css'
import { Gift, Share2, Plus, ArrowLeft, Image as ImageIcon, X } from 'lucide-react'
import { MoodTag } from '@/components/ui/MoodTag'
import { TypeSelector } from '@/components/ui/TypeSelector'
import { ContentCard } from '@/components/capsule/ContentCard'
import { useStore } from '@/lib/store'
import type { ContentType, CapsuleItem } from '@/types'

const breakpointCols = { default: 3, 1100: 2, 640: 1 }

const COVER_COLOURS = [
  '#0d1220', // deep navy
  '#1a1000', // dark amber
  '#1a1200', // dark gold
  '#0f1419', // dark teal
  '#1a0a0a', // dark wine
  '#0a1a0a', // dark forest
  '#1a0d1a', // dark plum
  '#141414', // near-black grey
]

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function CoverEditor({
  currentColour,
  currentImage,
  onColour,
  onImage,
  onClose,
}: {
  currentColour?: string
  currentImage?: string
  onColour: (c: string) => void
  onImage: (url: string) => void
  onClose: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onImage(url)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        zIndex: 200,
        marginTop: 8,
        backgroundColor: '#161616',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: 20,
        width: 260,
        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          change cover
        </p>
        <button
          type="button"
          onClick={onClose}
          style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
          className="hover:text-white/60 transition-colors"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Colour swatches */}
      <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>colour</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {COVER_COLOURS.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => { onColour(c); onClose() }}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: c,
              border: currentColour === c
                ? '1.5px solid rgba(255,255,255,0.7)'
                : '0.5px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              transform: currentColour === c ? 'scale(1.15)' : 'none',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            aria-label={c}
          />
        ))}
      </div>

      {/* Upload photo */}
      <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>photo</p>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: 100,
          border: '0.5px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.04)',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 13,
          fontWeight: 300,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'background 0.15s ease, border-color 0.15s ease',
        }}
        className="hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.25)]"
      >
        <ImageIcon size={14} strokeWidth={1.5} />
        upload image
      </button>
      {currentImage && (
        <button
          type="button"
          onClick={() => { onImage(''); onClose() }}
          style={{
            width: '100%',
            marginTop: 8,
            padding: '8px 16px',
            borderRadius: 100,
            border: '0.5px solid rgba(255,255,255,0.08)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.3)',
            fontSize: 12,
            fontWeight: 300,
            cursor: 'pointer',
            transition: 'color 0.15s ease',
          }}
          className="hover:text-white/50"
        >
          remove photo
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </motion.div>
  )
}

export default function CapsuleViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { getCapsule, getItems, dispatch } = useStore()
  const [showAddContent, setShowAddContent] = useState(false)
  const [showCoverEditor, setShowCoverEditor] = useState(false)
  const [selectedType, setSelectedType] = useState<ContentType | null>(null)
  const [addInput, setAddInput] = useState('')
  const [addLoading, setAddLoading] = useState(false)

  const capsule = getCapsule(id)
  const items = getItems(id)

  if (!capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center space-y-4">
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>capsule not found</p>
          <Link href="/home" style={{ fontSize: 13, fontWeight: 300, color: '#fff', textDecoration: 'none' }}
            className="hover:text-white/70 transition-colors">← home</Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(capsule.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const headerBg = capsule.cover_colour ?? '#111111'

  async function handleAddItem() {
    if (!selectedType || !addInput.trim()) return
    const input = addInput.trim()

    setAddLoading(true)

    let item: CapsuleItem = {
      id: `item-${uid()}`,
      capsule_id: id,
      type: selectedType,
      position: items.length,
      title: input,
      metadata: {},
      created_at: new Date().toISOString(),
    }

    try {
      if (selectedType === 'music') {
        const isUrl = input.startsWith('http')
        const body = isUrl ? { url: input } : { query: input }
        const res = await fetch('/api/spotify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const data = await res.json()
          item = {
            ...item,
            title: data.title,
            subtitle: data.subtitle,
            thumbnail_url: data.thumbnail_url,
            external_url: data.external_url,
            metadata: { spotify_id: data.spotify_id, embed_url: data.embed_url },
          }
        } else {
          // Fallback: keep placeholder metadata
          item = {
            ...item,
            subtitle: 'track not found',
            metadata: { spotify_id: uid(), embed_url: '' },
          }
        }
      } else if (selectedType === 'article' || selectedType === 'link') {
        const url = input.startsWith('http') ? input : `https://${input}`
        const res = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
        if (res.ok) {
          const data = await res.json()
          item = {
            ...item,
            title: data.title ?? input,
            subtitle: data.hostname ?? new URL(url).hostname,
            thumbnail_url: data.image,
            external_url: url,
            metadata: { og_description: data.description },
          }
        } else {
          item = {
            ...item,
            title: input,
            subtitle: (() => { try { return new URL(url).hostname } catch { return url } })(),
            external_url: url,
            metadata: {},
          }
        }
      } else if (selectedType === 'journal') {
        item = { ...item, metadata: { text: input } }
      } else if (selectedType === 'place') {
        item = { ...item, metadata: { lat: 40.7128, lng: -74.006 } }
      }
    } catch {
      // Network error — use what we have
    }

    dispatch({ type: 'ADD_ITEM', payload: item })
    setAddInput('')
    setSelectedType(null)
    setShowAddContent(false)
    setAddLoading(false)
  }

  function togglePublic() {
    if (!capsule) return
    dispatch({ type: 'UPDATE_CAPSULE', payload: { id, is_public: !capsule.is_public } })
  }

  function handleCoverColour(colour: string) {
    dispatch({ type: 'UPDATE_CAPSULE', payload: { id, cover_colour: colour } })
  }

  function handleCoverImage(url: string) {
    dispatch({
      type: 'UPDATE_CAPSULE',
      payload: { id, cover_image_url: url || undefined },
    })
  }

  const sortedItems = items.slice().sort((a, b) => a.position - b.position)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Hero header */}
      <div
        className="relative px-7 pt-12 pb-8"
        style={{
          background: capsule.cover_image_url
            ? `linear-gradient(to bottom, ${headerBg}80 0%, #0a0a0a 100%)`
            : `linear-gradient(to bottom, ${headerBg} 0%, #0a0a0a 100%)`,
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        }}
      >
        {capsule.cover_image_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={capsule.cover_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.2 }}
            loading="lazy"
          />
        )}

        <div className="relative">
          {/* Top row */}
          <div className="flex justify-between items-center mb-8">
            <motion.button
              type="button"
              onClick={() => router.back()}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.4)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              className="hover:text-white/70 transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              back
            </motion.button>

            {/* Desktop action pills */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Change cover */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setShowCoverEditor(v => !v)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.35)',
                    border: 'none',
                    padding: '7px 4px',
                    fontSize: 12,
                    fontWeight: 300,
                    cursor: 'pointer',
                    transition: 'color 0.15s ease',
                  }}
                  className="hover:text-white/60"
                >
                  <ImageIcon size={13} strokeWidth={1.5} />
                  cover
                </motion.button>

                <AnimatePresence>
                  {showCoverEditor && (
                    <CoverEditor
                      currentColour={capsule.cover_colour}
                      currentImage={capsule.cover_image_url}
                      onColour={handleCoverColour}
                      onImage={handleCoverImage}
                      onClose={() => setShowCoverEditor(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              <motion.div whileTap={{ scale: 0.95 }} whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <Link
                  href={`/capsule/${id}/gift`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(255,200,100,0.08)',
                    color: 'rgba(255,200,100,0.85)',
                    border: '0.5px solid rgba(255,200,100,0.25)',
                    padding: '9px 18px',
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 400,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-[rgba(255,200,100,0.14)] hover:border-[rgba(255,200,100,0.5)]"
                >
                  <Gift size={14} strokeWidth={1.5} />
                  gift
                </Link>
              </motion.div>

              <motion.button
                type="button"
                onClick={togglePublic}
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.75)',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                  padding: '9px 18px',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 400,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                }}
                className="hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)] hover:text-white"
              >
                <Share2 size={14} strokeWidth={1.5} />
                {capsule.is_public ? 'make private' : 'fork to public'}
              </motion.button>
            </div>

            {/* Mobile: overflow button */}
            <div className="flex sm:hidden items-center gap-3">
              {/* cover button always visible on mobile too */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setShowCoverEditor(v => !v)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.35)',
                    border: 'none',
                    padding: '7px 4px',
                    fontSize: 12,
                    fontWeight: 300,
                    cursor: 'pointer',
                  }}
                >
                  <ImageIcon size={14} strokeWidth={1.5} />
                </motion.button>
                <AnimatePresence>
                  {showCoverEditor && (
                    <CoverEditor
                      currentColour={capsule.cover_colour}
                      currentImage={capsule.cover_image_url}
                      onColour={handleCoverColour}
                      onImage={handleCoverImage}
                      onClose={() => setShowCoverEditor(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
              <button
                type="button"
                style={{
                  fontSize: 18,
                  color: 'rgba(255,255,255,0.5)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: 2,
                }}
              >
                ···
              </button>
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-white leading-tight mb-4 line-clamp-2"
            style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 500, letterSpacing: '-0.03em' }}
          >
            {capsule.name}
          </h1>

          {/* Tags + date */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {capsule.mood_tags.map(tag => (
              <MoodTag key={tag} label={tag} />
            ))}
            <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.25)' }}>
              · {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Inline add-content panel */}
      <AnimatePresence>
        {showAddContent && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              margin: '24px 28px 0',
              borderRadius: 14,
              padding: 20,
              border: '0.5px solid rgba(255,255,255,0.1)',
              backgroundColor: '#111111',
            }}
          >
            <TypeSelector selected={selectedType} onChange={t => { setSelectedType(t); setAddInput('') }} />
            {selectedType && (
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={addInput}
                  onChange={e => setAddInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddItem()}
                  placeholder={
                    selectedType === 'music'   ? 'spotify link or track name...' :
                    selectedType === 'journal' ? 'write here...' :
                    selectedType === 'place'   ? 'search a place...' :
                    'paste a link...'
                  }
                  className="flex-1 bg-transparent outline-none border-b pb-2 placeholder:text-white/20"
                  style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                  autoFocus
                />
                <motion.button
                  type="button"
                  onClick={handleAddItem}
                  disabled={addLoading}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 100,
                    border: '0.5px solid rgba(255,255,255,0.2)',
                    fontSize: 13,
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.6)',
                    background: 'transparent',
                    cursor: addLoading ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                    opacity: addLoading ? 0.5 : 1,
                  }}
                  className="hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)] hover:text-white transition-all"
                >
                  {addLoading ? '…' : 'add →'}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Masonry grid */}
      <div style={{ padding: '32px 28px 80px' }}>
        {sortedItems.length === 0 && !showAddContent && (
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.25)', padding: '32px 0' }}>
            nothing here yet. add something that makes this feeling real.
          </p>
        )}

        {sortedItems.length > 0 && (
          <Masonry
            breakpointCols={breakpointCols}
            className="masonry-grid"
            columnClassName="masonry-grid-col"
          >
            {sortedItems.map((item, i) => (
              <ContentCard
                key={item.id}
                {...item}
                is_primary_music={item.type === 'music' && i === 0}
                onUpdateNote={note =>
                  dispatch({ type: 'UPDATE_ITEM', payload: { ...item, user_note: note } })
                }
              />
            ))}
          </Masonry>
        )}
      </div>

      {/* Floating add button */}
      <motion.button
        type="button"
        className="add-fab"
        onClick={() => setShowAddContent(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        aria-label="Add content"
        style={{ rotate: showAddContent ? '45deg' : '0deg', transition: 'transform 0.2s ease, rotate 0.2s ease' }}
      >
        <Plus size={24} strokeWidth={2} />
      </motion.button>
    </div>
  )
}
