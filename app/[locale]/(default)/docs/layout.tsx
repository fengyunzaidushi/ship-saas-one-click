import { DocsSidebarNav } from '@/components/docs/DocsSidebarNav'

interface DocsLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function DocsLayout({
  children,
  params
}: DocsLayoutProps) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <div className="fixed h-full py-6 pl-8 pr-6 lg:pt-10">
          <DocsSidebarNav params={Promise.resolve(params)} />
        </div>
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  )
}
