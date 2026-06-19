'use client'

import { use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Masonry from 'react-masonry-css'
import { MoodTag } from '@/components/ui/MoodTag'
import { ContentCard } from '@/components/capsule/ContentCard'
import { useStore } from '@/lib/store'

const breakpointCols = { default: 3, 1100: 2, 640: 1 }

function Countdown({ target }: { target: string }) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  return (
    <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.35)', fontVariantNumeric: 'tabular-nums' }}>
      opens in {days}d {hours}h {mins}m
    </p>
  )
}

export default function GiftRecipientPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const { gifts, getCapsule, getItems } = useStore()

  const gift = gifts.find(g => g.token === token)

  if (!gift) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center space-y-3">
          <p style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff' }}>nothing here</p>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>this gift link isn&apos;t valid</p>
          <Link href="/" style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
            className="hover:text-white block mt-2">← go home</Link>
        </div>
      </div>
    )
  }

  const capsule = getCapsule(gift.capsule_id)
  const items = getItems(gift.capsule_id)

  const isSealed =
    gift.reveal_mode === 'timed' &&
    gift.reveal_at != null &&
    new Date(gift.reveal_at) > new Date()

  const isOnRequest = gift.reveal_mode === 'on_request' && !gift.unlocked_at

  // Sealed state
  if (isSealed) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-7"
        style={{ backgroundColor: '#0a0a0a', gap: 24 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            border: '0.5px solid rgba(255,200,100,0.3)',
            backgroundColor: 'rgba(255,200,100,0.04)',
          }}
        >
          ✉
        </motion.div>
        <div className="space-y-2">
          <p style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff' }}>
            a feeling is waiting for you
          </p>
          {gift.recipient_name && (
            <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>
              for {gift.recipient_name}
            </p>
          )}
        </div>
        {gift.reveal_at && <Countdown target={gift.reveal_at} />}
        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,200,100,0.5)' }}>
          from someone who thought of you
        </p>
      </div>
    )
  }

  // On-request state
  if (isOnRequest) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-7"
        style={{ backgroundColor: '#0a0a0a', gap: 24 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            border: '0.5px solid rgba(255,255,255,0.1)',
            backgroundColor: '#111111',
          }}
        >
          🔒
        </motion.div>
        <div className="space-y-2">
          <p style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff' }}>
            this capsule is locked
          </p>
          <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>
            ask the sender to unlock it for you
          </p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => alert('request sent!')}
          style={{
            padding: '13px 28px',
            borderRadius: 100,
            background: '#ffffff',
            color: '#0a0a0a',
            fontSize: 14,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          request to open →
        </motion.button>
      </div>
    )
  }

  if (!capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>capsule not found</p>
      </div>
    )
  }

  const sortedItems = items.slice().sort((a, b) => a.position - b.position)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Hero header */}
      <div
        className="relative px-7 pt-12 pb-8"
        style={{
          background: capsule.cover_image_url
            ? `linear-gradient(to bottom, ${capsule.cover_colour ?? '#111111'}80 0%, #0a0a0a 100%)`
            : `linear-gradient(to bottom, ${capsule.cover_colour ?? '#111111'} 0%, #0a0a0a 100%)`,
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

        {/* Amber gift badge */}
        <div className="relative mb-8 flex items-center justify-between">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 100,
              border: '0.5px solid rgba(255,200,100,0.3)',
              backgroundColor: 'rgba(255,200,100,0.06)',
              fontSize: 11,
              fontWeight: 300,
              letterSpacing: '0.08em',
              color: 'rgba(255,200,100,0.75)',
            }}
          >
            ✦ a feeling gifted to you
          </div>
          <Link
            href="/"
            style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
            className="hover:text-white/60 transition-colors"
          >
            ememo
          </Link>
        </div>

        <div className="relative">
          <h1
            className="text-white leading-tight mb-4 line-clamp-2"
            style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 500, letterSpacing: '-0.03em' }}
          >
            {capsule.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {capsule.mood_tags.map(tag => (
              <MoodTag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>

      {/* Sender's note */}
      {gift.recipient_note && (
        <div
          style={{
            margin: '24px 28px 0',
            borderRadius: 14,
            padding: '16px 20px',
            borderLeft: '0.5px solid rgba(255,200,100,0.4)',
            backgroundColor: 'rgba(255,200,100,0.04)',
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,200,100,0.5)', marginBottom: 8 }}>
            a note for you
          </p>
          <p style={{ fontSize: 13, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.65, color: 'rgba(255,255,255,0.6)' }}>
            {gift.recipient_note}
          </p>
        </div>
      )}

      {/* Masonry content */}
      <div style={{ padding: '32px 28px 80px' }}>
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
                readonly
              />
            ))}
          </Masonry>
        )}
      </div>

      {/* Fork CTA — fixed bottom */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 28px 24px',
          background: 'linear-gradient(to top, #0a0a0a 70%, transparent)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 50,
        }}
      >
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
          <Link
            href="/home"
            style={{
              display: 'inline-block',
              padding: '13px 28px',
              borderRadius: 100,
              background: '#ffffff',
              color: '#0a0a0a',
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              textDecoration: 'none',
            }}
          >
            fork to my shelf →
          </Link>
        </motion.div>
        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.25)' }}>
          saves a copy to your collection
        </p>
      </div>
    </div>
  )
}
