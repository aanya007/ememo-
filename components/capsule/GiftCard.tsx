'use client'

import Link from 'next/link'

interface GiftCardProps {
  token: string
  capsuleName: string
  cover_image_url?: string
  cover_colour?: string
  senderName: string
  senderNote?: string
  isSealed?: boolean
}

export function GiftCard({
  token,
  capsuleName,
  cover_image_url,
  cover_colour = '#111111',
  senderName,
  isSealed = false,
}: GiftCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
        ✦ from {senderName}
      </p>
      <Link
        href={`/gift/${token}`}
        className="relative block overflow-hidden transition-all duration-[350ms] hover:-translate-y-2 hover:scale-[1.02]"
        style={{
          width: 140,
          height: 180,
          borderRadius: 14,
          backgroundColor: cover_colour,
          borderLeft: '0.5px solid rgba(255,200,100,0.4)',
          transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {cover_image_url && !isSealed && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        )}

        {isSealed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl opacity-40">✉</span>
          </div>
        )}

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.8) 100%)' }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-[12px] font-medium text-white leading-snug line-clamp-2">{capsuleName}</p>
          {isSealed && (
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,200,100,0.6)' }}>sealed</p>
          )}
        </div>
      </Link>
    </div>
  )
}
