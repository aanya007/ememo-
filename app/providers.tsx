'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { StoreProvider } from '@/lib/store'

function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Snapshot {pathname, children} into local state, updated only after commit.
  // AnimatePresence must own the timing of when its keyed child changes — keying
  // it directly off the router's live `pathname`/`children` props lets the new
  // route's content land inside the old child before its exit animation
  // finishes, freezing the new page at the exit keyframe (opacity: 0).
  const [content, setContent] = useState({ pathname, children })

  useEffect(() => {
    setContent({ pathname, children })
  }, [pathname, children])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={content.pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {content.children}
      </motion.div>
    </AnimatePresence>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <PageTransition>{children}</PageTransition>
    </StoreProvider>
  )
}
