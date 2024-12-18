import { redirect } from 'next/navigation'
import { allDocs } from 'contentlayer/generated'

// 添加格式化路径的辅助函数
function formatDocPath(path: string, locale: string): string {
  // 分割路径
  const parts = path.split('/')
  
  // 找到 docs 后的部分
  const docsIndex = parts.findIndex(part => part === 'docs')
  const pathParts = parts.slice(docsIndex + 1)
  
  // 格式化每个部分并重新组合
  const formattedParts = pathParts
    .map(part => part.replace(/^\d+-/, ''))
    .join('/')

  // 构建最终路径
  if (locale === 'en') {
    return `/docs/${formattedParts}`
  }
  
  return `/${locale}/docs/${formattedParts}`
}

export default function DocsPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  // 获取当前语言的文档
  const docs = allDocs.filter(doc => {
    const docLocale = doc.filePath.split('/')[1]
    return docLocale === locale
  })

  // 找到第一个文档作为默认重定向目标
  const firstDoc = docs.find(doc => doc.slugAsParams.includes('getting-started'))
  
  if (!firstDoc) {
    // 如果没有找到文档，重定向到 404 页面或首页
    redirect(`/${locale}`)
  }

  // 使用格式化后的路径进行重定向
  const formattedPath = formatDocPath(firstDoc.path, locale)
  redirect(formattedPath)
} 