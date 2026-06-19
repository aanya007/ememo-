'use client'

interface MapThumbProps {
  lat?: number
  lng?: number
  label?: string
  onClick?: () => void
  expanded?: boolean
}

export function MapThumb({ lat, lng, label, onClick, expanded = false }: MapThumbProps) {
  if (expanded && lat && lng) {
    return (
      <div className="w-full rounded-[8px] overflow-hidden mt-3">
        <iframe
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
          width="100%"
          height="200"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={label ?? 'Location'}
        />
        {label && (
          <p className="text-[12px] text-white/40 mt-2">{label}</p>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex-shrink-0" style={{ width: 52, height: 52 }}>
      {/* Expands on hover via CSS width transition; position:absolute so it overlays without affecting layout */}
      <div
        className="absolute left-0 top-0 h-[52px] w-[52px] hover:w-[200px] rounded-[10px] hover:rounded-[12px] overflow-hidden group cursor-pointer z-10"
        style={{
          backgroundColor: '#1a2a1a',
          transition: 'width 350ms ease, border-radius 350ms ease',
        }}
        onClick={onClick}
        title={label}
      >
        {/* Dot + halo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute rounded-full" style={{ width: 18, height: 18, backgroundColor: 'rgba(74,222,128,0.18)' }} />
            <div className="rounded-full" style={{ width: 8, height: 8, backgroundColor: '#4ade80' }} />
          </div>
        </div>
        {/* Label — fades in when expanded */}
        {label && (
          <span
            className="absolute bottom-1.5 left-2 text-[9px] text-white/55 opacity-0 group-hover:opacity-100 whitespace-nowrap"
            style={{ transition: 'opacity 180ms ease 150ms' }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
