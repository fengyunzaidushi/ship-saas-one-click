'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { allDocs } from 'contentlayer/generated'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { use } from 'react'
import { ChevronRight } from 'lucide-react'

interface DocItem {
  slugAsParams: string
  path: string
  title: string
  nav_title?: string
  locale?: string
  description?: string
  filePath: string
}

interface DocGroup {
  id: string
  title: string
  items: DocItem[]
}

// Helper function to get locale-specific docs
function getLocaleDocs(docs: DocItem[], locale: string) {
  return docs.filter((doc) => {
    if (!doc.locale) {
      const localeFromPath = doc.filePath.split('/')[1]
      return localeFromPath === locale
    }
    return doc.locale === locale
  })
}

function formatGroupTitle(folder: string) {
  return folder.replace(/^\d+-/, '').replace(/-/g, ' ')
}

function createDocGroups(docs: DocItem[]): DocGroup[] {
  const groupMap = new Map<string, DocGroup>()

  docs.forEach((doc) => {
    const parts = doc.slugAsParams.split('/')
    const groupId = parts[1] || 'ungrouped'

    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, {
        id: groupId,
        title: formatGroupTitle(groupId),
        items: []
      })
    }

    groupMap.get(groupId)?.items.push(doc)
  })

  // Sort groups and their items
  return Array.from(groupMap.values())
    .sort((a, b) => {
      const aNum = parseInt(a.id.match(/^\d+/)?.[0] || '0')
      const bNum = parseInt(b.id.match(/^\d+/)?.[0] || '0')
      return aNum - bNum
    })
    .map(group => ({
      ...group,
      items: group.items.sort((a, b) => {
        const aNum = parseInt(a.filePath.match(/\/\d+-/)?.[0]?.replace(/\D/g, '') || '0')
        const bNum = parseInt(b.filePath.match(/\/\d+-/)?.[0]?.replace(/\D/g, '') || '0')
        return aNum - bNum
      })
    }))
}

// 添加一个清理文本的辅助函数
function cleanText(text: string): string {
  // 移除所有的回车符(\r)、换行符(\n)和多余的空格
  return text.replace(/[\r\n]+/g, '').trim()
}

// 添加路径格式化函数
function formatDocPath(path: string, locale: string): string {
  // 分割路径
  const parts = path.split('/')

  // 处理不同语言的路径格式
  const baseIndex = parts.findIndex(part => part === 'docs')
  const pathParts = parts.slice(baseIndex + 1)

  // 格式化每个路径段，移除数字前缀
  const formattedParts = pathParts.map(part =>
    part.replace(/^\d+-/, '')
  )

  // 构建最终路径
  if (locale === 'en') {
    return `/docs/${formattedParts.join('/')}`
  }

  return `/${locale}/docs/${formattedParts.join('/')}`
}

// 添加检查index文件的辅助函数
function getGroupIndexPath(items: DocItem[]): string | null {
  const indexDoc = items.find(doc => doc.filePath.endsWith('index.mdx'))
  return indexDoc ? indexDoc.path : null
}

export function DocsSidebarNav({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const pathname = usePathname()
  const resolvedParams = use(params)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  const groups = useMemo(() => {
    if (!resolvedParams?.locale) {
      console.warn('No locale found in params')
      return []
    }

    const localeDocs = getLocaleDocs(allDocs, resolvedParams.locale)
    return createDocGroups(localeDocs)
  }, [resolvedParams?.locale])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  if (groups.length === 0) {
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
      {groups.map((group) => {
        const indexPath = getGroupIndexPath(group.items)
        const formattedIndexPath = indexPath ? formatDocPath(indexPath, resolvedParams.locale) : null

        return (
          <div key={group.id} className="pb-8">
            {formattedIndexPath ? (
              <div className="flex items-center">
                <Link
                  href={formattedIndexPath}
                  className="flex-grow flex items-center rounded-md px-2 py-1 text-sm font-semibold hover:bg-accent/50 transition-colors"
                >
                  {cleanText(group.title)}
                </Link>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="p-1 hover:bg-accent/50 rounded-md"
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedGroups[group.id] ? "transform rotate-90" : ""
                    )}
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between mb-1 rounded-md px-2 py-1 text-sm font-semibold hover:bg-accent/50 transition-colors"
              >
                {cleanText(group.title)}
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedGroups[group.id] ? "transform rotate-90" : ""
                  )}
                />
              </button>
            )}
            <div className={cn(
              "transition-all duration-200 ease-in-out",
              expandedGroups[group.id] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )}>
              <ul className="space-y-1">
                {group.items
                  .filter(doc => !doc.filePath.endsWith('index.mdx'))
                  .map((doc, index) => {
                    // 格式化文档路径
                    const formattedPath = formatDocPath(doc.path, resolvedParams.locale)

                    return (
                      <li key={`${doc.slugAsParams}-${index}`}>
                        <Link
                          href={formattedPath}
                          className={cn(
                            "flex w-full items-center rounded-md p-2 text-sm hover:underline",
                            pathname === formattedPath
                              ? "font-medium text-primary"
                              : "text-muted-foreground"
                          )}
                          aria-current={pathname === formattedPath ? 'page' : undefined}
                        >
                          <div>
                            <div>{cleanText(doc.nav_title || doc.title)}</div>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </div>
        )
      })}
    </nav>
  )
} 