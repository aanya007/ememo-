'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MoodTag } from '@/components/ui/MoodTag'
import { TypeSelector } from '@/components/ui/TypeSelector'
import { ContentBlock } from '@/components/capsule/ContentBlock'
import { useStore } from '@/lib/store'
import type { ContentType, CapsuleItem } from '@/types'
import Link from 'next/link'

const FEELING_CHIPS = [
  "3am can't sleep",
  'dancing in the rain at night',
  'first coffee alone in a new city',
  'that sunday feeling',
  'running through a train station',
  'the last day of summer',
  'finding a song that explains everything',
  'when the light hits just right',
]

const SUGGESTED_TAGS = ['nostalgia', 'joy', 'aliveness', 'longing', 'calm', 'restless', 'wonder']

const COVER_COLOURS = ['#0d1220', '#1a1000', '#1a1200', '#0f1419', '#1a0a0a']

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function makeItem(type: ContentType, input: string, capsuleId: string): CapsuleItem {
  const base: CapsuleItem = {
    id: `item-${uid()}`,
    capsule_id: capsuleId,
    type,
    position: 0,
    title: input || 'untitled',
    metadata: {},
    created_at: new Date().toISOString(),
  }

  if (type === 'music') {
    const isSpotify = input.includes('spotify.com/track/')
    const trackId = isSpotify ? input.split('/track/')[1]?.split('?')[0] : uid()
    return {
      ...base,
      title: isSpotify ? 'loading…' : input,
      subtitle: isSpotify ? '' : 'add artist name',
      thumbnail_url: `https://picsum.photos/seed/${trackId}/100/100`,
      external_url: isSpotify ? input : undefined,
      metadata: {
        spotify_id: trackId,
        embed_url: `https://open.spotify.com/embed/track/${trackId}`,
      },
    }
  }
  if (type === 'place') {
    return { ...base, title: input, subtitle: 'location', metadata: { lat: 40.7128, lng: -74.006 } }
  }
  if (type === 'article' || type === 'link') {
    return {
      ...base,
      title: input,
      subtitle: new URL(input.startsWith('http') ? input : `https://${input}`).hostname,
      thumbnail_url: `https://picsum.photos/seed/${uid()}/100/100`,
      external_url: input.startsWith('http') ? input : `https://${input}`,
      metadata: { og_description: 'Article content will be scraped when the API is wired.' },
    }
  }
  if (type === 'journal') {
    const now = new Date()
    return {
      ...base,
      title: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      subtitle: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      metadata: { text: input },
    }
  }
  return base
}

function NewCapsuleForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { dispatch, items: storeItems } = useStore()

  const prefill = params.get('feeling') ?? ''
  const [name, setName] = useState(prefill)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<ContentType | null>(null)
  const [typeInput, setTypeInput] = useState('')
  const [capsuleId] = useState(() => `cap-new-${uid()}`)
  const [items, setItems] = useState<CapsuleItem[]>([])
  const [coverColour, setCoverColour] = useState(COVER_COLOURS[0])
  const [coverImage, setCoverImage] = useState<string | undefined>()
  const [addLoading, setAddLoading] = useState(false)
  const fillRef = useRef<HTMLDivElement>(null)
  const journalRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (prefill && fillRef.current) {
      setTimeout(() => fillRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400)
    }
  }, [prefill])

  function addTag(value: string) {
    const t = value.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  async function addItem() {
    if (!selectedType || !typeInput.trim()) return
    const input = typeInput.trim()
    setAddLoading(true)
    setTypeInput('')

    let item = makeItem(selectedType, input, capsuleId)

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
        }
      }
    } catch {
      // Network error — keep placeholder
    }

    setItems(prev => [...prev, { ...item, position: prev.length }])
    setAddLoading(false)
  }

  function handleAddJournal() {
    if (!typeInput.trim()) return
    const item = makeItem('journal', typeInput.trim(), capsuleId)
    setItems(prev => [...prev, { ...item, position: prev.length }])
    setTypeInput('')
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setCoverImage(url)
    const item: CapsuleItem = {
      id: `item-${uid()}`,
      capsule_id: capsuleId,
      type: 'image',
      position: items.length,
      title: file.name,
      thumbnail_url: url,
      metadata: {},
      created_at: new Date().toISOString(),
    }
    if (selectedType === 'image') setItems(prev => [...prev, item])
    else setCoverImage(url)
  }

  function saveCapsule() {
    dispatch({
      type: 'CREATE_CAPSULE',
      payload: {
        id: capsuleId,
        user_id: 'user-1',
        name: name || 'untitled feeling',
        mood_tags: tags,
        cover_image_url: coverImage,
        cover_colour: coverColour,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
    items.forEach(item => dispatch({ type: 'ADD_ITEM', payload: item }))
    router.push(`/capsule/${capsuleId}`)
  }

  return (
    <div className="min-h-screen px-7 py-10" style={{ backgroundColor: '#0a0a0a', maxWidth: 640, margin: '0 auto' }}>
      {/* Back */}
      <Link
        href="/home"
        className="mb-10 block hover:text-white/60 transition-colors"
        style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        ← home
      </Link>

      {/* Step 1 — Name */}
      <section className="mb-12">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="what does this feeling feel like?"
          className="w-full bg-transparent outline-none text-white placeholder:text-white/20 border-b pb-3"
          style={{ fontSize: 24, fontWeight: 400, borderColor: 'rgba(255,255,255,0.08)' }}
          autoFocus={!prefill}
        />

        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.25)', marginTop: 12, marginBottom: 16 }}>
          name it however feels right — a lyric, a sentence, a moment in time
        </p>

        {/* Tag input */}
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(t => (
            <MoodTag key={t} label={t} onRemove={() => setTags(prev => prev.filter(x => x !== t))} />
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) } }}
          placeholder="add mood tags — press enter"
          className="w-full bg-transparent outline-none text-[13px] placeholder:text-white/20"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        />
        {tagInput === '' && tags.length === 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTED_TAGS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => addTag(t)}
                className="px-3 py-[5px] rounded-full border text-[11px] transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.25)' }}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Feeling chips (shown only if no name pre-filled) */}
        {!prefill && !name && (
          <div className="flex flex-wrap gap-2 mt-8">
            {FEELING_CHIPS.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => setName(chip)}
                className="px-4 py-2 rounded-full border text-[13px] transition-all hover:border-white/35 hover:text-white/70"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)' }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Step 2 — Fill it */}
      <section className="mb-12" ref={fillRef}>
        <p style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
          fill it
        </p>
        <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
          what's the first thing that comes to mind?
          <span className="ml-1" style={{ color: 'rgba(255,255,255,0.2)' }}>a song? a place? a photo? a memory?</span>
        </p>

        <TypeSelector selected={selectedType} onChange={t => { setSelectedType(t); setTypeInput('') }} />

        {selectedType && (
          <div className="mt-4 space-y-3">
            {selectedType === 'journal' ? (
              <div className="relative">
                <textarea
                  ref={journalRef}
                  value={typeInput}
                  onChange={e => setTypeInput(e.target.value)}
                  placeholder="write here..."
                  className="w-full bg-transparent outline-none text-[14px] placeholder:text-white/20 resize-none border-b pb-3"
                  style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.08)', minHeight: 100 }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddJournal}
                  className="mt-2 px-4 py-2 rounded-full border text-[13px] transition-colors hover:border-white/40"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
                >
                  add entry →
                </button>
              </div>
            ) : selectedType === 'image' ? (
              <label className="flex flex-col items-center justify-center gap-2 rounded-[14px] border-dashed border cursor-pointer hover:border-white/30 transition-colors py-8"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>drag & drop or click to upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typeInput}
                  onChange={e => setTypeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addItem()}
                  placeholder={
                    selectedType === 'music'   ? 'paste a spotify link or type a track name...' :
                    selectedType === 'place'   ? 'search a place...' :
                    'paste a link...'
                  }
                  className="flex-1 bg-transparent outline-none text-[14px] border-b pb-2 placeholder:text-white/20"
                  style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={addItem}
                  disabled={addLoading}
                  className="px-4 py-2 rounded-full border text-[13px] flex-shrink-0 transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', opacity: addLoading ? 0.5 : 1, cursor: addLoading ? 'not-allowed' : 'pointer' }}
                >
                  {addLoading ? '…' : 'add →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Added items */}
        {items.length > 0 && (
          <div className="mt-6 space-y-3">
            {items.map((item, i) => (
              <ContentBlock
                key={item.id}
                {...item}
                is_primary_music={item.type === 'music' && i === 0}
              />
            ))}
          </div>
        )}
      </section>

      {/* Step 3 — Dress it */}
      {(items.length > 0 || name) && (
        <section className="mb-12">
          <p style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
            dress it
          </p>

          {!coverImage && (
            <div>
              <p className="text-[12px] mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>pick a colour for your card</p>
              <div className="flex gap-3">
                {COVER_COLOURS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCoverColour(c)}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      backgroundColor: c,
                      border: coverColour === c ? '1px solid rgba(255,255,255,0.5)' : '0.5px solid rgba(255,255,255,0.15)',
                      transform: coverColour === c ? 'scale(1.15)' : 'none',
                    }}
                    aria-label={c}
                  />
                ))}
              </div>
              <p className="text-[12px] mt-3" style={{ color: 'rgba(255,255,255,0.2)' }}>or upload a cover image</p>
              <label className="mt-2 inline-flex px-4 py-2 rounded-full border text-[13px] cursor-pointer hover:border-white/30 transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}>
                choose image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          )}

          {coverImage && (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="cover" className="w-12 h-16 object-cover rounded-[8px]" />
              <button
                type="button"
                onClick={() => setCoverImage(undefined)}
                className="text-[12px] transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                remove
              </button>
            </div>
          )}
        </section>
      )}

      {/* Save */}
      <button
        type="button"
        onClick={saveCapsule}
        style={{
          width: '100%',
          padding: '14px 24px',
          borderRadius: 100,
          background: '#ffffff',
          color: '#0a0a0a',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.15s ease',
        }}
        className="hover:opacity-88"
      >
        save capsule →
      </button>
    </div>
  )
}

export default function NewCapsulePage() {
  return (
    <Suspense>
      <NewCapsuleForm />
    </Suspense>
  )
}
