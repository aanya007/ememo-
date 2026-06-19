'use client'

import Link from 'next/link'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

interface CapsuleCardProps {
  id: string
  name: string
  cover_image_url?: string
  cover_colour?: string
  item_count: number
  rotation_deg?: number
  offset_x?: number
  z_index?: number
  variant?: 'shelf' | 'explore'
  is_new?: boolean
  width?: number
  height?: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (rotation: number) => ({
    opacity: 1,
    y: 0,
    rotate: rotation,
    transition: { type: 'spring' as const, stiffness: 200, damping: 22 },
  }),
}

function ShelfCard({
  id,
  name,
  cover_image_url,
  cover_colour = '#111111',
  item_count,
  rotation_deg = 0,
  z_index = 1,
  is_new = false,
  width = 200,
  height = 280,
}: CapsuleCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [8, -8])
  const rotateY = useTransform(x, [-50, 50], [-8, 8])
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  if (is_new) {
    return (
      <motion.div
        custom={rotation_deg}
        variants={cardVariants}
        style={{
          width,
          height,
          rotateX: springRotateX,
          rotateY: springRotateY,
          zIndex: z_index,
          transformStyle: 'preserve-3d',
          perspective: 800,
        }}
        whileHover={{
          y: -20,
          scale: 1.04,
          rotate: 0,
          zIndex: 50,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        whileTap={{ scale: 0.97 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href="/capsule/new"
          className="flex flex-col items-center justify-center gap-2 w-full h-full text-white/25 hover:text-white/45 transition-colors duration-200"
          style={{
            borderRadius: 18,
            border: '0.5px dashed rgba(255,255,255,0.18)',
          }}
        >
          <span className="text-2xl font-light leading-none">+</span>
          <span className="text-[12px] tracking-wide font-light">new feeling</span>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      custom={rotation_deg}
      variants={cardVariants}
      style={{
        width,
        height,
        rotateX: springRotateX,
        rotateY: springRotateY,
        zIndex: z_index,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      whileHover={{
        y: -20,
        scale: 1.04,
        rotate: 0,
        zIndex: 50,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/capsule/${id}`}
        className="group relative block w-full h-full overflow-hidden"
        style={{
          borderRadius: 18,
          backgroundColor: cover_colour,
        }}
      >
        {cover_image_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={cover_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.82) 100%)' }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p
            className="text-white leading-snug mb-1 line-clamp-2"
            style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.03em' }}
          >
            {name}
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 300 }}>
            {item_count} {item_count === 1 ? 'thing' : 'things'}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

export function CapsuleCard(props: CapsuleCardProps) {
  const { variant = 'shelf' } = props

  if (variant === 'explore') {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <Link
          href={`/capsule/${props.id}`}
          className="relative block overflow-hidden"
          style={{
            borderRadius: 14,
            backgroundColor: props.cover_colour ?? '#111111',
            height: 200,
          }}
        >
          {props.cover_image_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={props.cover_image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.85) 100%)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '-0.02em', color: '#fff' }} className="line-clamp-2 leading-snug mb-1">
              {props.name}
            </p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
              {props.item_count} {props.item_count === 1 ? 'thing' : 'things'}
            </p>
          </div>
        </Link>
      </motion.div>
    )
  }

  return <ShelfCard {...props} />
}
