'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import type { ComponentProps } from 'react'

import { useMounted } from '@/lib/hooks/use-mounted'

export default function Template({ children }: ComponentProps<'div'>) {
  const isMounted = useMounted()
  const pathname = usePathname()

  if (!isMounted || pathname.endsWith('/docs')) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.7 }}
    >
      {children}
    </motion.div>
  )
}
