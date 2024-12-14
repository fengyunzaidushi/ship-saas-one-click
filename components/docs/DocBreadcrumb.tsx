import Link from 'next/link'
import { ChevronRightIcon } from '@radix-ui/react-icons'

interface DocBreadcrumbProps {
  slug: string[]
}

export default function DocBreadcrumb({ slug }: DocBreadcrumbProps) {
  return (
    <nav className="mb-4 flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
        </li>
        {slug.map((segment, index) => {
          const isLast = index === slug.length - 1
          return (
            <li key={segment} className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              {isLast ? (
                <span className="ml-1 text-sm font-medium text-foreground">
                  {segment}
                </span>
              ) : (
                <Link
                  href={`/docs/${slug.slice(0, index + 1).join('/')}`}
                  className="ml-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {segment}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
} 