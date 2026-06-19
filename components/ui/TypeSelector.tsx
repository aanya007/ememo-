'use client'

import type { ContentType } from '@/types'

const TYPES: { type: ContentType; label: string }[] = [
  { type: 'music',   label: 'music' },
  { type: 'image',   label: 'image' },
  { type: 'place',   label: 'place' },
  { type: 'article', label: 'article' },
  { type: 'journal', label: 'journal' },
]

const TYPE_ACTIVE_STYLE: Record<ContentType, React.CSSProperties> = {
  music:   { background: 'rgba(255,200,100,0.85)', color: '#0a0a0a', borderColor: 'rgba(255,200,100,0.85)' },
  place:   { background: '#4ade80',                color: '#0a0a0a', borderColor: '#4ade80' },
  journal: { background: '#c084fc',                color: '#0a0a0a', borderColor: '#c084fc' },
  image:   { background: '#60a5fa',                color: '#0a0a0a', borderColor: '#60a5fa' },
  article: { background: '#ffffff',                color: '#0a0a0a', borderColor: '#ffffff' },
  link:    { background: '#ffffff',                color: '#0a0a0a', borderColor: '#ffffff' },
}

interface TypeSelectorProps {
  selected: ContentType | null
  onChange: (type: ContentType) => void
}

export function TypeSelector({ selected, onChange }: TypeSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      {TYPES.map(({ type, label }) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          style={selected === type ? { ...TYPE_ACTIVE_STYLE[type], transition: 'all 0.15s ease' } : { transition: 'all 0.15s ease' }}
          className={`flex-shrink-0 px-4 py-[7px] rounded-full text-[13px] border ${
            selected === type
              ? ''
              : 'border-white/20 text-white/55 hover:border-white/40 hover:text-white/80'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
