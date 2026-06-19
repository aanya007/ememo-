'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Gift } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { RevealMode } from '@/types'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export default function GiftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { getCapsule, getItems, dispatch } = useStore()

  const capsule = getCapsule(id)
  const items = getItems(id)

  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [note, setNote] = useState('')
  const [revealMode, setRevealMode] = useState<RevealMode>('instant')
  const [revealDate, setRevealDate] = useState('')
  const [sent, setSent] = useState(false)

  if (!capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>capsule not found</p>
      </div>
    )
  }

  function handleSend() {
    const token = `gift-${uid()}`
    dispatch({
      type: 'CREATE_GIFT',
      payload: {
        id: `gift-${uid()}`,
        capsule_id: id,
        sender_id: 'user-1',
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        recipient_note: note,
        reveal_mode: revealMode,
        reveal_at: revealMode === 'timed' && revealDate ? new Date(revealDate).toISOString() : undefined,
        token,
        created_at: new Date().toISOString(),
      },
    })
    setSent(true)
    setTimeout(() => router.push('/home'), 2200)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-7" style={{ backgroundColor: '#0a0a0a' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="space-y-3"
        >
          <p style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff' }}>
            feeling sent ✦
          </p>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>
            {recipientName || recipientEmail} will receive it soon.
          </p>
        </motion.div>
      </div>
    )
  }

  const MODES: { value: RevealMode; label: string; desc: string }[] = [
    { value: 'instant',    label: 'instant',    desc: 'they open it right away' },
    { value: 'timed',      label: 'timed',      desc: 'set a reveal date' },
    { value: 'on_request', label: 'on request', desc: 'they ask, you unlock' },
  ]

  return (
    <div
      className="min-h-screen px-7 py-10"
      style={{ backgroundColor: '#0a0a0a', maxWidth: 560, margin: '0 auto' }}
    >
      {/* Back */}
      <motion.div whileTap={{ scale: 0.97 }} className="mb-10 inline-block">
        <Link
          href={`/capsule/${id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.35)',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          className="hover:text-white/60"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          back to capsule
        </Link>
      </motion.div>

      {/* Header */}
      <div className="mb-10">
        <h1
          style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff' }}
          className="flex items-center gap-3"
        >
          <Gift size={22} strokeWidth={1.5} style={{ color: 'rgba(255,200,100,0.7)' }} />
          gift this feeling
        </h1>
        <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
          &ldquo;{capsule.name}&rdquo; → someone you love
        </p>
      </div>

      <div className="space-y-8">
        {/* Recipient */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>
            to
          </p>
          <input
            type="text"
            value={recipientName}
            onChange={e => setRecipientName(e.target.value)}
            placeholder="their name"
            className="w-full bg-transparent outline-none pb-2 border-b mb-3 placeholder:text-white/20"
            style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
          />
          <input
            type="email"
            value={recipientEmail}
            onChange={e => setRecipientEmail(e.target.value)}
            placeholder="their email"
            className="w-full bg-transparent outline-none pb-2 border-b placeholder:text-white/20"
            style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
          />
        </div>

        {/* Note */}
        <div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="leave them a note... (optional)"
            className="w-full bg-transparent outline-none placeholder:text-white/20 resize-none border-b pb-2"
            style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)', minHeight: 80 }}
          />
        </div>

        {/* Reveal mode */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>
            how they open it
          </p>
          <div className="flex gap-2 flex-wrap">
            {MODES.map(({ value, label, desc }) => (
              <motion.button
                key={value}
                type="button"
                onClick={() => setRevealMode(value)}
                whileTap={{ scale: 0.95 }}
                title={desc}
                style={{
                  padding: '9px 18px',
                  borderRadius: 100,
                  border: `0.5px solid ${revealMode === value ? 'rgba(255,200,100,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  color: revealMode === value ? 'rgba(255,200,100,0.9)' : 'rgba(255,255,255,0.45)',
                  background: revealMode === value ? 'rgba(255,200,100,0.06)' : 'transparent',
                  fontSize: 13,
                  fontWeight: revealMode === value ? 400 : 300,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </motion.button>
            ))}
          </div>
          {revealMode === 'timed' && (
            <input
              type="datetime-local"
              value={revealDate}
              onChange={e => setRevealDate(e.target.value)}
              className="mt-3 bg-transparent outline-none border-b pb-2"
              style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}
            />
          )}
          {revealMode !== 'instant' && (
            <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
              {MODES.find(m => m.value === revealMode)?.desc}
            </p>
          )}
        </div>

        {/* Preview card */}
        <div
          style={{
            borderRadius: 14,
            padding: '16px 20px',
            border: '0.5px solid rgba(255,200,100,0.2)',
            backgroundColor: 'rgba(255,200,100,0.03)',
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,200,100,0.5)', marginBottom: 10 }}>
            they&apos;ll see
          </p>
          <ul className="space-y-1">
            <li style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>
              · {items.length} thing{items.length !== 1 ? 's' : ''} in this capsule
            </li>
            {note && (
              <li style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>· your note</li>
            )}
            <li style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>
              · option to fork it to their shelf
            </li>
          </ul>
        </div>

        {/* Send button */}
        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!recipientEmail}
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1, opacity: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: recipientEmail ? 1 : 0.4,
          }}
        >
          <Gift size={15} strokeWidth={1.5} />
          send the feeling →
        </motion.button>
      </div>
    </div>
  )
}
