'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CapsuleShelf } from '@/components/capsule/CapsuleShelf'
import { useStore } from '@/lib/store'

export default function LandingPage() {
  const { capsules, items } = useStore()

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-7 h-14 sticky top-0 z-50 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#0a0a0a' }}
      >
        <span style={{ fontSize: 15, fontWeight: 400, letterSpacing: '0.04em', color: '#ffffff' }}>
          ememo
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/home"
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
            className="hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)] hover:text-white hidden sm:inline-flex"
          >
            sign in
          </Link>
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
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
              }}
            >
              start a capsule
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-7 pt-20 pb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-white leading-tight max-w-2xl"
          style={{ fontSize: 'clamp(34px, 5vw, 58px)', fontWeight: 500, letterSpacing: '-0.03em' }}
        >
          a place for feelings<br />that have no name
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4"
          style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}
        >
          collect everything that makes a feeling real.
        </motion.p>

        {/* Shelf preview — non-interactive */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full mt-16 mb-12"
          style={{ maxWidth: 900 }}
        >
          {/* Ambient green glow behind shelf */}
          <div
            style={{
              position: 'absolute',
              inset: '-20%',
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(74,222,128,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <CapsuleShelf
              capsules={capsules.slice(0, 4)}
              items={items}
              showNewCard={false}
              interactive={true}
            />
            <div
              className="absolute inset-y-0 left-0 w-24 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #0a0a0a, transparent)' }}
            />
            <div
              className="absolute inset-y-0 right-0 w-24 pointer-events-none"
              style={{ background: 'linear-gradient(to left, #0a0a0a, transparent)' }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -2 }}
        >
          <Link
            href="/capsule/new"
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
              transition: 'opacity 0.15s ease',
            }}
            className="hover:opacity-88"
          >
            start your first capsule →
          </Link>
        </motion.div>
      </section>

      {/* How it works */}
      <section
        className="px-7 py-16 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { n: '01', label: 'name a feeling', sub: 'a lyric, a sentence, a moment in time.' },
            { n: '02', label: 'fill it',         sub: 'music, places, photos, words. everything the feeling is made of.' },
            { n: '03', label: 'revisit or gift', sub: 'keep it private, share it, or send it to someone you love.' },
          ].map(({ n, label, sub }) => (
            <div key={n} className="space-y-2">
              <p style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                {n}
              </p>
              <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{label}</p>
              <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.6, color: 'rgba(255,255,255,0.35)' }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Auth */}
      <section
        className="px-7 py-12 border-t text-center space-y-5"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.3)' }}>
          sign in to save your capsules
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {['continue with google', 'magic link'].map(label => (
            <motion.div
              key={label}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Link
                href="/home"
                style={{
                  display: 'inline-block',
                  padding: '9px 18px',
                  borderRadius: 100,
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.75)',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                  fontSize: 13,
                  fontWeight: 400,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
                className="hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)] hover:text-white"
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}
