import Link from 'next/link'
import { Doc } from 'contentlayer/generated'
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'

interface DocsPagerProps {
  prev?: Doc
  next?: Doc
}

export default function DocsPager({ prev, next }: DocsPagerProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      {prev && (
        <Link
          href={prev.path}
          className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm text-foreground hover:bg-accent"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          {prev.nav_title || prev.title}
        </Link>
      )}
      {next && (
        <Link
          href={next.path}
          className="ml-auto inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm text-foreground hover:bg-accent"
        >
          {next.nav_title || next.title}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  )
} 