'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { allDocs } from 'contentlayer/generated'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { use } from 'react'

interface DocItem {
  slugAsParams: string
  path: string
  title: string
  nav_title?: string
  order?: number
  locale?: string
}

interface DocGroup {
  [key: string]: {
    title: string
    items: DocItem[]
  }
}

// Helper function to get locale-specific docs
function getLocaleDocs(docs: DocItem[], locale: string) {
  return docs.filter((doc) => doc.locale === locale)
}

export function DocsSidebarNav({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const pathname = usePathname()
  const resolvedParams = use(params)

  // Memoize the groups to prevent unnecessary recalculations
  const groups = useMemo(() => {
    const localeDocs = getLocaleDocs(allDocs, resolvedParams.locale)
    
    return localeDocs.reduce((acc: DocGroup, doc) => {
      if (doc.slugAsParams === 'index') return acc
      
      const [group] = doc.slugAsParams.split('/')
      if (!acc[group]) {
        acc[group] = {
          title: group,
          items: []
        }
      }
      acc[group].items.push(doc)
      
      // Sort items immediately when adding
      acc[group].items.sort((a, b) => (a.order || 0) - (b.order || 0))
      
      return acc
    }, {})
  }, [resolvedParams.locale])

  return (
    <nav className="w-full" role="navigation" aria-label="Documentation sidebar">
      {Object.entries(groups).map(([key, group]) => (
        <div key={key} className="pb-8">
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold capitalize">
            {key.replace(/-/g, ' ')}
          </h4>
          <ul className="space-y-1">
            {group.items.map((doc) => (
              <li key={doc.slugAsParams}>
                <Link
                  href={doc.path}
                  className={cn(
                    "flex w-full items-center rounded-md p-2 text-sm hover:underline",
                    pathname === doc.path
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  )}
                  aria-current={pathname === doc.path ? 'page' : undefined}
                >
                  {doc.nav_title || doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
} 