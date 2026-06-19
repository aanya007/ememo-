'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GhostPillProps {
  label: string
  icon?: ReactNode
  onClick?: () => void
  variant?: 'default' | 'gift' | 'filled' | 'primary' | 'ghost'
  href?: string
  className?: string
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: {
    background: '#ffffff',
    color: '#0a0a0a',
    border: 'none',
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  default: {
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.75)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 400,
  },
  gift: {
    background: 'rgba(255,200,100,0.08)',
    color: 'rgba(255,200,100,0.85)',
    border: '0.5px solid rgba(255,200,100,0.25)',
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 400,
  },
  filled: {
    background: '#ffffff',
    color: '#0a0a0a',
    border: 'none',
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 500,
  },
  ghost: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.35)',
    border: '0.5px solid rgba(255,255,255,0.08)',
    padding: '7px 14px',
    fontSize: 12,
    fontWeight: 300,
  },
}

const BASE_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  borderRadius: 100,
  cursor: 'pointer',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
}

export function GhostPill({ label, icon, onClick, variant = 'default', href, className = '' }: GhostPillProps) {
  const style = { ...BASE_STYLE, ...VARIANT_STYLES[variant] }

  if (href) {
    return (
      <motion.div
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{ display: 'inline-flex' }}
      >
        <Link href={href} style={style} className={className}>
          {icon}
          {label}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={style}
      className={className}
    >
      {icon}
      {label}
    </motion.button>
  )
}
