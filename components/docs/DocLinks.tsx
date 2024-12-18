import Link from 'next/link'
import { ArrowRightIcon } from '@radix-ui/react-icons'

// 更新接口以匹配 contentlayer 生成的类型
interface DocLink {
  title: string
  href?: string
  path?: string  // 添加 path 作为可选属性
  description?: string
}

interface DocLinksProps {
  links: DocLink[] | DocLink | undefined
}

export default function DocLinks({ links }: DocLinksProps) {
  // 如果没有链接，不渲染任何内容
  if (!links) return null
  
  // 确保 links 是数组
  const linkArray = Array.isArray(links) ? links : [links]

  return (
    <div className="my-8 grid gap-4 md:grid-cols-2">
      {linkArray.map((link) => {
        // 使用 href 或 path 作为链接地址
        const linkHref = link.href || link.path || '#'
        
        return (
          <Link
            key={linkHref}
            href={linkHref}
            className="group relative rounded-lg border p-4 hover:border-foreground"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{link.title}</h3>
              <ArrowRightIcon className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            {link.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {link.description}
              </p>
            )}
          </Link>
        )
      })}
    </div>
  )
} 