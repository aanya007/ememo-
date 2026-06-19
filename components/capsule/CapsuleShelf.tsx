'use client'

import { motion } from 'framer-motion'
import { CapsuleCard } from './CapsuleCard'
import type { Capsule, CapsuleItem } from '@/types'

const ROTATIONS = [-9, -5, -1, 3, 7, -7, 4, -3]
const CARD_W = 200
const CARD_OVERLAP = 130

interface CapsuleShelfProps {
  capsules: Capsule[]
  items: Record<string, CapsuleItem[]>
  showNewCard?: boolean
  interactive?: boolean
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
}

export function CapsuleShelf({
  capsules,
  items,
  showNewCard = false,
  interactive = true,
}: CapsuleShelfProps) {
  const allCards = [...capsules, ...(showNewCard ? ['new'] : [])]
  const cardCount = allCards.length
  const shelfWidth = CARD_W + (cardCount - 1) * (CARD_W - CARD_OVERLAP)
  const mid = Math.floor(capsules.length / 2)

  return (
    <>
      {/* Desktop: centred stacked shelf */}
      <div
        className="hidden sm:flex w-full justify-center items-end overflow-visible"
        style={{ height: 360, paddingBottom: 10, paddingTop: 30, pointerEvents: interactive ? 'auto' : 'none' }}
      >
        <motion.div
          className="relative"
          style={{ width: shelfWidth, height: 300 }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {capsules.map((capsule, i) => {
            const itemCount = (items[capsule.id] ?? []).length
            const zIndex = 10 - Math.abs(i - mid)
            const offsetX = i * (CARD_W - CARD_OVERLAP)
            const rotation = ROTATIONS[i % ROTATIONS.length]
            return (
              <div
                key={capsule.id}
                style={{ position: 'absolute', left: offsetX, top: 0, zIndex }}
              >
                <CapsuleCard
                  id={capsule.id}
                  name={capsule.name}
                  cover_image_url={capsule.cover_image_url}
                  cover_colour={capsule.cover_colour}
                  item_count={itemCount}
                  rotation_deg={rotation}
                  z_index={zIndex}
                  variant="shelf"
                />
              </div>
            )
          })}
          {showNewCard && (
            <div
              style={{
                position: 'absolute',
                left: capsules.length * (CARD_W - CARD_OVERLAP),
                top: 0,
                zIndex: 1,
              }}
            >
              <CapsuleCard
                id="new"
                name=""
                item_count={0}
                rotation_deg={ROTATIONS[capsules.length % ROTATIONS.length]}
                z_index={1}
                variant="shelf"
                is_new
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile: horizontal scroll snap */}
      <div
        className="flex sm:hidden overflow-x-auto scrollbar-none gap-3 pb-4"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          padding: '16px 20px',
          pointerEvents: interactive ? 'auto' : 'none',
        }}
      >
        {capsules.map((capsule) => {
          const itemCount = (items[capsule.id] ?? []).length
          return (
            <div
              key={capsule.id}
              style={{ scrollSnapAlign: 'center', flexShrink: 0 }}
            >
              <CapsuleCard
                id={capsule.id}
                name={capsule.name}
                cover_image_url={capsule.cover_image_url}
                cover_colour={capsule.cover_colour}
                item_count={itemCount}
                rotation_deg={0}
                z_index={1}
                variant="shelf"
                width={170}
                height={240}
              />
            </div>
          )
        })}
        {showNewCard && (
          <div style={{ scrollSnapAlign: 'center', flexShrink: 0 }}>
            <CapsuleCard
              id="new"
              name=""
              item_count={0}
              rotation_deg={0}
              z_index={1}
              variant="shelf"
              is_new
              width={170}
              height={240}
            />
          </div>
        )}
      </div>
    </>
  )
}
