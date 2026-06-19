'use client'

import { useState } from 'react'
import { IconWriting, IconChevronRight, IconChevronDown } from '@tabler/icons-react'
import { VinylThumb } from '@/components/media/VinylThumb'
import { MapThumb } from '@/components/media/MapThumb'
import { GhostPill } from '@/components/ui/GhostPill'
import type { ContentType } from '@/types'

interface ContentBlockProps {
  id: string
  type: ContentType
  title: string
  subtitle?: string
  thumbnail_url?: string
  external_url?: string
  metadata: Record<string, unknown>
  user_note?: string
  is_primary_music?: boolean
  onUpdateNote?: (note: string) => void
  readonly?: boolean
}

const TYPE_LABELS: Record<ContentType, string> = {
  music:   'music',
  image:   'image',
  place:   'place',
  article: 'article',
  journal: 'journal',
  link:    'link',
}

function Thumbnail({
  type,
  thumbnail_url,
  metadata,
  label,
  is_primary_music,
  onClick,
}: {
  type: ContentType
  thumbnail_url?: string
  metadata: Record<string, unknown>
  label?: string
  is_primary_music?: boolean
  onClick?: () => void
}) {
  if (type === 'music') {
    return <VinylThumb spinning={is_primary_music} />
  }
  if (type === 'place') {
    return (
      <MapThumb
        lat={metadata.lat as number}
        lng={metadata.lng as number}
        label={label}
        onClick={onClick}
      />
    )
  }
  if (type === 'journal') {
    return (
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-[10px]"
        style={{ width: 52, height: 52, backgroundColor: '#181818' }}
      >
        <IconWriting size={18} style={{ color: 'rgba(255,255,255,0.2)' }} />
      </div>
    )
  }
  if (thumbnail_url) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={thumbnail_url}
        alt=""
        className="flex-shrink-0 object-cover rounded-[10px]"
        style={{ width: 52, height: 52 }}
      />
    )
  }
  return (
    <div
      className="flex-shrink-0 rounded-[10px]"
      style={{ width: 52, height: 52, backgroundColor: '#181818' }}
    />
  )
}

function ExpandedContent({
  type,
  thumbnail_url,
  external_url,
  metadata,
  label,
}: {
  type: ContentType
  thumbnail_url?: string
  external_url?: string
  metadata: Record<string, unknown>
  label?: string
}) {
  const embedUrl = metadata.embed_url as string | undefined
  const isRealSpotify = embedUrl && !embedUrl.includes('example')

  if (type === 'music') {
    if (isRealSpotify) {
      return (
        <iframe
          src={`${embedUrl}?utm_source=generator&theme=0`}
          width="100%"
          height="80"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ border: 0, borderRadius: 8 }}
          title="Spotify player"
        />
      )
    }
    return (
      <div
        className="w-full rounded-[8px] flex items-center gap-3 px-4"
        style={{ height: 64, backgroundColor: '#181818' }}
      >
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#222' }} />
        <div>
          <p className="text-[13px] text-white/70">Preview unavailable in demo</p>
          {external_url && (
            <a href={external_url} target="_blank" rel="noopener noreferrer"
              className="text-[11px] text-white/35 hover:text-white/60 transition-colors">
              open in spotify →
            </a>
          )}
        </div>
      </div>
    )
  }

  if (type === 'place') {
    return <MapThumb lat={metadata.lat as number} lng={metadata.lng as number} label={label} expanded />
  }

  if (type === 'image' && thumbnail_url) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={thumbnail_url}
        alt=""
        className="w-full rounded-[8px] object-cover"
        style={{ maxHeight: 300 }}
      />
    )
  }

  if ((type === 'article' || type === 'link') && metadata.og_description) {
    return (
      <div className="space-y-2">
        <p className="text-[13px] leading-relaxed line-clamp-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {metadata.og_description as string}
        </p>
        {external_url && (
          <a href={external_url} target="_blank" rel="noopener noreferrer"
            className="text-[12px] text-white/35 hover:text-white/60 transition-colors">
            open article →
          </a>
        )}
      </div>
    )
  }

  if (type === 'journal') {
    return (
      <p className="text-[13px] italic leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {metadata.text as string}
      </p>
    )
  }

  return null
}

export function ContentBlock({
  id,
  type,
  title,
  subtitle,
  thumbnail_url,
  external_url,
  metadata,
  user_note,
  is_primary_music = false,
  onUpdateNote,
  readonly = false,
}: ContentBlockProps) {
  const [expanded, setExpanded] = useState(false)
  const [editingNote, setEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(user_note ?? '')

  const openActionLabel =
    type === 'music'   ? 'open in spotify' :
    type === 'place'   ? 'view on maps' :
    (type === 'article' || type === 'link') ? 'open article' :
    null

  const openActionHref =
    type === 'music'  ? external_url :
    type === 'place'  ? `https://maps.google.com/maps?q=${metadata.lat},${metadata.lng}` :
    (type === 'article' || type === 'link') ? external_url :
    null

  return (
    <div
      id={id}
      className="border rounded-[14px] overflow-hidden transition-colors duration-200"
      style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#111111' }}
    >
      {/* Collapsed header — always visible */}
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 hover:bg-[#181818] transition-colors duration-150"
        style={{ height: 68 }}
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        {/* Type label */}
        <span
          className="uppercase tracking-[0.12em] flex-shrink-0"
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', width: 40 }}
        >
          {TYPE_LABELS[type]}
        </span>

        {/* Thumbnail */}
        <Thumbnail
          type={type}
          thumbnail_url={thumbnail_url}
          metadata={metadata}
          label={subtitle}
          is_primary_music={is_primary_music}
          onClick={() => { /* click on map thumb bubbles up to expand block */ }}
        />

        {/* Title + subtitle */}
        <div className="flex-1 text-left min-w-0 pl-1">
          <p className="text-[14px] text-white truncate">{title}</p>
          {subtitle && (
            <p className="text-[12px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Chevron */}
        <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
          {expanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
        </span>
      </button>

      {/* Expanded content — animates open */}
      <div
        className="overflow-hidden transition-all duration-[400ms] ease-in-out"
        style={{ maxHeight: expanded ? 600 : 0 }}
      >
        <div className="px-4 pb-4 pt-1 space-y-3">
          {/* Type-specific content */}
          <ExpandedContent
            type={type}
            thumbnail_url={thumbnail_url}
            external_url={external_url}
            metadata={metadata}
            label={subtitle}
          />

          {/* User note */}
          {(noteValue || !readonly) && (
            <div>
              {editingNote && !readonly ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full bg-transparent text-[13px] italic resize-none outline-none border-b"
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      lineHeight: 1.6,
                      borderColor: 'rgba(255,255,255,0.1)',
                      minHeight: 60,
                    }}
                    value={noteValue}
                    onChange={e => setNoteValue(e.target.value)}
                    autoFocus
                    placeholder="add a note about this..."
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-[12px] text-white/50 hover:text-white/80 transition-colors"
                      onClick={() => {
                        onUpdateNote?.(noteValue)
                        setEditingNote(false)
                      }}
                    >
                      save
                    </button>
                    <button
                      type="button"
                      className="text-[12px] text-white/25 hover:text-white/50 transition-colors"
                      onClick={() => { setNoteValue(user_note ?? ''); setEditingNote(false) }}
                    >
                      cancel
                    </button>
                  </div>
                </div>
              ) : noteValue ? (
                <p
                  className="text-[13px] italic leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}
                >
                  {noteValue}
                </p>
              ) : null}
            </div>
          )}

          {/* Action pills */}
          {!readonly && (
            <div className="flex flex-wrap gap-2 pt-1">
              {openActionLabel && openActionHref && (
                <GhostPill label={openActionLabel} href={openActionHref} />
              )}
              {!editingNote && (
                <GhostPill
                  label={noteValue ? 'edit note' : '+ add note'}
                  onClick={() => setEditingNote(true)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
