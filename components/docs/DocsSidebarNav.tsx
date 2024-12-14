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
  // 添加日志来调试
  console.log('Current locale:', locale)
  console.log('Available docs:', docs.map(doc => ({ 
    path: doc.path, 
    locale: doc.locale 
  })))
  
  // 如果文档没有locale属性，使用路径中的locale
  return docs.filter((doc) => {
    if (!doc.locale) {
      // 从路径中提取locale
      const localeFromPath = doc.path.split('/')[1]
      return localeFromPath === locale
    }
    return doc.locale === locale
  })
}

export function DocsSidebarNav({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const pathname = usePathname()
  const resolvedParams = use(params)

  // 添加日志来验证resolvedParams
  console.log('Resolved params:', resolvedParams)

  // Memoize the groups to prevent unnecessary recalculations
  const groups = useMemo(() => {
    if (!resolvedParams?.locale) {
      console.error('No locale found in params')
      return {}
    }
    console.log('All docs:', allDocs.length)

    const localeDocs = getLocaleDocs(allDocs, resolvedParams.locale)
    console.log('length', localeDocs.length)
    console.log('Filtered docs:', localeDocs)
    
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
  }, [resolvedParams?.locale])

  // 如果没有分组，显示一个提示
  if (Object.keys(groups).length === 0) {
    return (
      <nav className="w-full" role="navigation" aria-label="Documentation sidebar">
        <div className="p-4 text-sm text-muted-foreground">
          No documentation available for this language.
        </div>
      </nav>
    )
  }

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