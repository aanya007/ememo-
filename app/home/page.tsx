'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CapsuleShelf } from '@/components/capsule/CapsuleShelf'
import { GiftCard } from '@/components/capsule/GiftCard'
import { CapsuleCard } from '@/components/capsule/CapsuleCard'
import { useStore } from '@/lib/store'

type Tab = 'mine' | 'gifted' | 'explore'

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('mine')
  const { capsules, items, gifts, publicCapsules } = useStore()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-7 h-14 border-b sticky top-0 z-50"
        style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#0a0a0a' }}
      >
        <Link
          href="/"
          style={{ fontSize: 15, fontWeight: 400, letterSpacing: '0.04em', color: '#ffffff' }}
        >
          ememo
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            style={{
              padding: '9px 18px',
              borderRadius: 100,
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.75)',
              border: '0.5px solid rgba(255,255,255,0.12)',
              fontSize: 13,
              fontWeight: 400,
              textDecoration: 'none',
              transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
            }}
            className="hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)] hover:text-white"
          >
            explore
          </Link>
          <Link
            href="/capsule/new"
            style={{
              padding: '9px 18px',
              borderRadius: 100,
              background: '#ffffff',
              color: '#0a0a0a',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              transition: 'opacity 0.15s ease',
            }}
            className="hover:opacity-88"
          >
            + new feeling
          </Link>
        </div>
      </nav>

      {/* Tabs */}
      <div
        className="flex gap-6 px-7 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {([['mine', 'mine'], ['gifted', 'gifted to me'], ['explore', 'explore']] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className="py-3 transition-all duration-200 border-b-[0.5px]"
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: tab === key ? '#ffffff' : 'rgba(255,255,255,0.35)',
              borderBottomColor: tab === key ? '#ffffff' : 'transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-7 py-8">
        {tab === 'mine' && (
          <div>
            <p
              style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}
            >
              your feelings
            </p>
            <CapsuleShelf
              capsules={capsules}
              items={items}
              showNewCard
              interactive
            />
          </div>
        )}

        {tab === 'gifted' && (
          <div>
            <p
              style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}
            >
              received
            </p>
            {gifts.length === 0 ? (
              <p className="text-[14px] text-white/30">no gifts yet.</p>
            ) : (
              <div className="flex gap-5 overflow-x-auto scrollbar-none pb-4">
                {gifts.map(gift => {
                  const capsule = capsules.find(c => c.id === gift.capsule_id)
                  const isSealed =
                    gift.reveal_mode === 'timed' &&
                    gift.reveal_at != null &&
                    new Date(gift.reveal_at) > new Date()
                  return (
                    <GiftCard
                      key={gift.id}
                      token={gift.token}
                      capsuleName={capsule?.name ?? 'a capsule'}
                      cover_image_url={capsule?.cover_image_url}
                      cover_colour={capsule?.cover_colour}
                      senderName={gift.sender_id === 'user-2' ? 'Maya' : 'Raf'}
                      senderNote={gift.recipient_note}
                      isSealed={isSealed}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'explore' && (
          <div>
            <p
              style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}
            >
              public capsules
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {publicCapsules.map(capsule => (
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
          </div>
        )}
      </div>
    </div>
  )
}
