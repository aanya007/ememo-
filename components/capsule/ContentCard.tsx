'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Edit2 } from 'lucide-react'
import { VinylThumb } from '@/components/media/VinylThumb'
import { MapThumb } from '@/components/media/MapThumb'
import { IconWriting } from '@tabler/icons-react'
import type { ContentType } from '@/types'

interface ContentCardProps {
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

const TYPE_COLOR: Record<ContentType, string> = {
  music:   'rgba(255,200,100,0.85)',
  place:   '#4ade80',
  journal: '#c084fc',
  image:   '#60a5fa',
  article: 'rgba(255,255,255,0.4)',
  link:    'rgba(255,255,255,0.4)',
}

function CardThumbnail({
  type,
  thumbnail_url,
  metadata,
  label,
  is_primary_music,
}: {
  type: ContentType
  thumbnail_url?: string
  metadata: Record<string, unknown>
  label?: string
  is_primary_music?: boolean
}) {
  if (type === 'music') {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: 180, background: 'radial-gradient(ellipse at center, rgba(255,200,100,0.07) 0%, #0d0d0d 65%)', borderRadius: 10 }}>
        <VinylThumb spinning={is_primary_music} size={120} />
      </div>
    )
  }

  if (type === 'place') {
    return (
      <div style={{ height: 180, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
        <MapThumb
          lat={metadata.lat as number}
          lng={metadata.lng as number}
          label={label}
          expanded
        />
      </div>
    )
  }

  if (type === 'journal') {
    return (
      <div
        className="w-full flex items-center justify-center"
        style={{ height: 100, background: 'radial-gradient(ellipse at center, rgba(192,132,252,0.07) 0%, #0d0d0d 65%)', borderRadius: 10 }}
      >
        <IconWriting size={28} style={{ color: 'rgba(192,132,252,0.4)' }} />
      </div>
    )
  }

  if (thumbnail_url) {
    const thumbH = type === 'image' ? 240 : 140
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={thumbnail_url}
        alt=""
        className="w-full object-cover"
        style={{ height: thumbH, borderRadius: 10 }}
        loading="lazy"
      />
    )
  }

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ height: 100, backgroundColor: '#0d0d0d', borderRadius: 10 }}
    />
  )
}

export function ContentCard({
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
}: ContentCardProps) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(user_note ?? '')

  const isJournal = type === 'journal'
  const openHref =
    type === 'music' ? external_url :
    type === 'place' ? `https://maps.google.com/maps?q=${metadata.lat},${metadata.lng}` :
    (type === 'article' || type === 'link') ? external_url :
    null

  const isSpanTwo = isJournal

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className={`content-card-hover${isSpanTwo ? ' masonry-span-two' : ''}`}
      id={id}
      style={{
        backgroundColor: '#111111',
        border: '0.5px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: 20,
        position: 'relative',
        cursor: 'default',
        transition: 'background-color 0.15s ease',
        overflow: 'hidden',
      }}
    >
      {/* Colored top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: TYPE_COLOR[type],
          opacity: 0.7,
        }}
      />

      {/* Type pill — top right */}
      <span
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: TYPE_COLOR[type],
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: `0.5px solid ${TYPE_COLOR[type]}`,
          borderRadius: 100,
          padding: '3px 8px',
          opacity: 0.85,
        }}
      >
        {TYPE_LABELS[type]}
      </span>

      {/* Thumbnail */}
      <div style={{ marginBottom: 14 }}>
        <CardThumbnail
          type={type}
          thumbnail_url={thumbnail_url}
          metadata={metadata}
          label={subtitle}
          is_primary_music={is_primary_music}
        />
      </div>

      {/* Title */}
      <p style={{ fontSize: 15, fontWeight: 400, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.4 }}>
        {title}
      </p>

      {/* Subtitle / metadata */}
      {subtitle && (
        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
          {subtitle}
        </p>
      )}

      {/* Journal full text */}
      {isJournal && typeof metadata.text === 'string' && (
        <p
          style={{
            fontSize: 13,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.5)',
            marginTop: 10,
            lineHeight: 1.65,
            fontWeight: 300,
            borderLeft: '2px solid rgba(192,132,252,0.45)',
            paddingLeft: 10,
          }}
        >
          {metadata.text}
        </p>
      )}

      {/* Article description */}
      {(type === 'article' || type === 'link') && typeof metadata.og_description === 'string' && (
        <p
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
            marginTop: 8,
            lineHeight: 1.55,
            fontWeight: 300,
          }}
          className="line-clamp-3"
        >
          {metadata.og_description}
        </p>
      )}

      {/* User note */}
      {(noteValue || (!readonly && !editingNote)) && !editingNote && noteValue ? (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '0.5px solid rgba(255,255,255,0.07)',
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
            }}
          >
            {noteValue}
          </p>
        </div>
      ) : null}

      {editingNote && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '0.5px solid rgba(255,255,255,0.07)',
          }}
        >
          <textarea
            className="w-full bg-transparent outline-none resize-none"
            style={{
              fontSize: 13,
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
              minHeight: 60,
              borderBottom: '0.5px solid rgba(255,255,255,0.1)',
            }}
            value={noteValue}
            onChange={e => setNoteValue(e.target.value)}
            autoFocus
            placeholder="add a note..."
          />
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}
              className="hover:text-white/80 transition-colors"
              onClick={() => {
                onUpdateNote?.(noteValue)
                setEditingNote(false)
              }}
            >
              save
            </button>
            <button
              type="button"
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}
              className="hover:text-white/50 transition-colors"
              onClick={() => { setNoteValue(user_note ?? ''); setEditingNote(false) }}
            >
              cancel
            </button>
          </div>
        </div>
      )}

      {/* Action links */}
      {!readonly && (
        <div className="flex flex-wrap gap-2" style={{ marginTop: 12 }}>
          {openHref && (
            <motion.a
              href={openHref}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.35)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 100,
                padding: '5px 10px',
                textDecoration: 'none',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                cursor: 'pointer',
              }}
              className="hover:text-white/60 hover:border-white/18"
            >
              <ExternalLink size={10} strokeWidth={1.5} />
              open
            </motion.a>
          )}
          {!editingNote && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditingNote(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.35)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 100,
                padding: '5px 10px',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
              className="hover:text-white/60"
            >
              <Edit2 size={10} strokeWidth={1.5} />
              {noteValue ? 'edit note' : '+ note'}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  )
}
