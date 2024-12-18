'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TocItem {
    value: string
    url: string
    depth: number
}

interface TableOfContentsProps {
    toc: TocItem[]
}

export function TableOfContents({ toc }: TableOfContentsProps) {
    const [activeHeading, setActiveHeading] = useState<string>('')

    useEffect(() => {
        const getHeadings = () => {
            const headings = document.querySelectorAll('h2, h3, h4')
            const headingElements = Array.from(headings)

            const visibleHeadings: IntersectionObserverEntry[] = []
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            visibleHeadings.push(entry)
                        }
                    })

                    if (visibleHeadings.length > 0) {
                        const lastVisibleHeading = visibleHeadings[0]
                        const id = lastVisibleHeading.target.getAttribute('id')
                        if (id) setActiveHeading(`#${id}`)
                    }
                },
                {
                    rootMargin: '0px 0px -80% 0px'
                }
            )

            headingElements.forEach((heading) => observer.observe(heading))

            return () => observer.disconnect()
        }

        getHeadings()
    }, [])

    if (!toc?.length) return null

    return (
        <div className="hidden xl:block">
            <div className="fixed  -mt-10 h-[calc(100vh-3.5rem)] min-w-[240px] max-w-[240px] overflow-y-auto ">
                <div className="space-y-2">
                    <p className="font-medium">目录</p>
                    <div className="space-y-1">
                        {toc.map((item) => (
                            <a
                                key={item.url}
                                href={item.url}
                                className={cn(
                                    'block text-sm transition-colors hover:text-foreground',
                                    item.url === activeHeading
                                        ? 'font-medium text-foreground'
                                        : 'text-muted-foreground',
                                    item.depth === 2 ? 'pl-4' : 'pl-8'
                                )}
                            >
                                {item.value}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
} 