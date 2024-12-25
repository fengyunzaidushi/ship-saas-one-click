import { ChevronRightIcon } from '@radix-ui/react-icons'

interface DocBreadcrumbProps {
  slug: string[]
}

export default function DocBreadcrumb({ slug }: DocBreadcrumbProps) {
  return (
    <nav className="mb-4 flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li>
          <span className="text-sm font-medium text-muted-foreground">
            Docs
          </span>
        </li>
        {slug.map((segment, index) => {
          return (
            <li key={segment} className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                {decodeURIComponent(segment)}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
} 