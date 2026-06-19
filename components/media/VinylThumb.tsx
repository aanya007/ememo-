'use client'

import { useId } from 'react'

interface VinylThumbProps {
  spinning?: boolean
  size?: number
}

export function VinylThumb({ spinning = false, size = 52 }: VinylThumbProps) {
  const gradId = useId()

  return (
    <div
      className={`rounded-full flex-shrink-0${spinning ? ' animate-vinyl-spin' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#222" />
            <stop offset="38%"  stopColor="#111" />
            <stop offset="68%"  stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0f0f0f" />
          </radialGradient>
        </defs>
        <circle cx="26" cy="26" r="26" fill={`url(#${gradId})`} />
        <circle cx="26" cy="26" r="23" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <circle cx="26" cy="26" r="20" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <circle cx="26" cy="26" r="17" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <circle cx="26" cy="26" r="14" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <circle cx="26" cy="26" r="10" fill="rgba(255,200,100,0.07)" />
        <circle cx="26" cy="26" r="4"  fill="#0a0a0a" stroke="rgba(255,200,100,0.7)" strokeWidth="1" />
      </svg>
    </div>
  )
}
