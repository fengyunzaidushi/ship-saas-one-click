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
    <div className="flex">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <DocsSidebarNav params={Promise.resolve(params)} />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  )
}
