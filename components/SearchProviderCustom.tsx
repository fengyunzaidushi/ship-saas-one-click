// components/SearchProviderCustom.tsx
'use client'

import { KBarSearchProvider } from 'pliny/search/KBar'
import { useRouter } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer'
import { Blog } from 'contentlayer/generated'
import { useParams } from 'next/navigation'

const SearchProviderCustom = ({ children }) => {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  return (
    <KBarSearchProvider
      kbarConfig={{
        searchDocumentsPath: '/search.json',
        onSearchDocumentsLoad(json) {
          return json
            // 过滤当前语言的文章
            .filter((post: CoreContent<Blog>) => post.locale === locale)
            .map((post: CoreContent<Blog>) => ({
              id: post.path,
              name: post.title,
              keywords: post?.summary || '',
              // section: 'Blog',
              subtitle: post.tags?.join(', ') || '',
              perform: () => {
                try {
                  // 使用文章自带的路径，无需额外添加 locale
                  const path = post.path
                  // 导航到文章页面
                  router.push(path)
                } catch (error) {
                  console.error('Navigation failed:', error)
                }
              },
            }))
        },

      }}
    >
      {children}
    </KBarSearchProvider>
  )
}

export default SearchProviderCustom