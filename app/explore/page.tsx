'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { CapsuleCard } from '@/components/capsule/CapsuleCard'
import { useStore } from '@/lib/store'

export default function ExplorePage() {
  const { publicCapsules, items } = useStore()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const allTags = Array.from(new Set(publicCapsules.flatMap(c => c.mood_tags)))

  const filtered = publicCapsules.filter(c => {
    const matchesTag = !activeTag || c.mood_tags.includes(activeTag)
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mood_tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchesTag && matchesSearch
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-7 h-14 border-b sticky top-0 z-50"
        style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#0a0a0a' }}
      >
        <span style={{ fontSize: 15, fontWeight: 400, letterSpacing: '0.04em', color: '#ffffff' }}>
          ememo
        </span>
        <motion.div whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
          <Link
            href="/home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            className="hover:text-white/70"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            my shelf
          </Link>
        </motion.div>
      </nav>

      <div className="px-7 py-8">
        <div className="flex items-center justify-between mb-6">
          <p style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
            explore
          </p>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="search feelings..."
            className="bg-transparent outline-none border-b pb-1 placeholder:text-white/20 text-right"
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.6)',
              borderColor: 'rgba(255,255,255,0.1)',
              width: 180,
            }}
          />
        </div>

        {/* Tag filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-4 mb-8">
          {[{ value: null, label: 'all' }, ...allTags.map(t => ({ value: t, label: t }))].map(({ value, label }) => (
            <motion.button
              key={label}
              type="button"
              onClick={() => setActiveTag(value === activeTag ? null : value)}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
              style={{
                padding: '7px 14px',
                borderRadius: 100,
                border: `0.5px solid ${activeTag === value ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.12)'}`,
                color: activeTag === value ? '#ffffff' : 'rgba(255,255,255,0.4)',
                background: activeTag === value ? 'rgba(255,255,255,0.06)' : 'transparent',
                fontSize: 12,
                fontWeight: 300,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, color 0.15s ease, background 0.15s ease',
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.3)' }}>no capsules found</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(capsule => (
              <CapsuleCard
                key={capsule.id}
                id={capsule.id}
                name={capsule.name}
                cover_image_url={capsule.cover_image_url}
                cover_colour={capsule.cover_colour}
                item_count={(items[capsule.id] ?? []).length}
                variant="explore"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
