import Link from 'next/link'
import { Doc } from 'contentlayer/generated'
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'

// 添加格式化路径的辅助函数
function formatDocPath(path: string, locale: string): string {
  // 分割路径
  const parts = path.split('/')

  // 找到 docs 后的部分
  const docsIndex = parts.findIndex(part => part === 'docs')
  const pathParts = parts.slice(docsIndex + 1)

  // 格式化每个部分并重新组合
  const formattedParts = pathParts
    .map(part => part.replace(/^\d+-/, ''))  // 移除每个部分的数字前缀
    .filter(Boolean)  // 移除空字符串
    .join('/')

  // 构建最终路径
  if (locale === 'en') {
    return `/docs/${formattedParts}`
  }

  return `/${locale}/docs/${formattedParts}`
}

interface DocsPagerProps {
  prev?: Doc
  next?: Doc
  locale: string
}

export default function DocsPager({ prev, next, locale }: DocsPagerProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      {prev && (
        <Link
          href={formatDocPath(prev.path, locale)}
          className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm text-foreground hover:bg-accent"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          {prev.nav_title || prev.title}
        </Link>
      )}
      {next && (
        <Link
          href={formatDocPath(next.path, locale)}
          className="ml-auto inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm text-foreground hover:bg-accent"
        >
          {next.nav_title || next.title}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  )
} 