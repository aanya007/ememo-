'use client'

interface MoodTagProps {
  label: string
  onRemove?: () => void
}

export function MoodTag({ label, onRemove }: MoodTagProps) {
  return (
    <span className="group inline-flex items-center gap-1 px-3 py-[5px] rounded-full border border-white/20 text-[11px] text-white/60 hover:border-white/35 transition-colors duration-200">
      {label}
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity duration-150 leading-none"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  )
}
