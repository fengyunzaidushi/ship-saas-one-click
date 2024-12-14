import Link from 'next/link'
import { ArrowRightIcon } from '@radix-ui/react-icons'

interface DocLinksProps {
  links: Array<{
    title: string
    href: string
    description?: string
  }>
}

export default function DocLinks({ links }: DocLinksProps) {
  return (
    <div className="my-8 grid gap-4 md:grid-cols-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
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
      ))}
    </div>
  )
} 