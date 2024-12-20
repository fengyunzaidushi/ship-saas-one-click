import React from 'react'
import { notFound } from 'next/navigation'
import { allDocs } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { components } from '@/components/MDXComponents'
import DocBreadcrumb from '@/components/docs/DocBreadcrumb'
import DocHeading from '@/components/docs/DocHeading'
import DocLinks from '@/components/docs/DocLinks'
import DocsPager from '@/components/docs/DocsPager'
import { Metadata } from 'next'
import { genPageMetadata } from '@/lib/seo'
import { TableOfContents } from '@/components/docs/TableOfContents'
import type { Doc } from 'contentlayer/generated'

interface DocPageProps {
  params: Promise<{
    slug?: string[]
    locale: string
  }>
}

// 添加格式化 slug 的辅助函数
function formatSlug(path: string): string {
  // 分割路径
  const parts = path.split('/')

  // 找到 docs 后的部分
  const docsIndex = parts.findIndex(part => part === 'docs')
  const relevantParts = parts.slice(docsIndex + 1)

  // 格式化每个部分并重新组合
  return relevantParts
    .map(part => part.replace(/^\d+-/, ''))
    .join('/')
}

// 添加格式化路径的辅助函数
function formatDocPath(path: string, locale: string): string {
  // 分割路径
  const parts = path.split('/')

  // 找到 docs 后的部分
  const docsIndex = parts.findIndex(part => part === 'docs')
  const pathParts = parts.slice(docsIndex + 1)

  // 格式化每个部分并重新组合
  const formattedParts = pathParts
    .map(part => part.replace(/^\d+-/, ''))  // 移除每个部分的数字前缀
    .filter(Boolean)  // 移除空字符串
    .join('/')

  // 构建最终路径
  if (locale === 'en') {
    return `/docs/${formattedParts}`
  }

  return `/${locale}/docs/${formattedParts}`
}

async function getDocFromParams(params: DocPageProps['params']) {
  const resolvedParams = await params
  const slug = resolvedParams.slug?.join('/') || ''
  const locale = resolvedParams.locale

  // 修改类型转换方式
  const localeDocs = (allDocs.filter(doc => {
    const docLocale = doc.filePath.split('/')[1]
    return docLocale === locale
  }) as unknown) as Doc[]

  const doc = localeDocs.find((doc) => {
    const formattedDocSlug = formatSlug(doc.path)
    return slug === ''
      ? formattedDocSlug === 'index'
      : formattedDocSlug === slug
  })

  if (!doc) {
    return null
  }

  return doc
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[]; locale: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const doc = await getDocFromParams(params)
  if (!doc) {
    return {}
  }

  return genPageMetadata({
    title: doc.title,
    description: doc.description,
    params: { locale: resolvedParams.locale },
  })
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params
  const doc = await getDocFromParams(params)

  if (!doc) {
    notFound()
  }

  // 在当前语言的文档中查找前后文档
  const localeDocs = allDocs.filter(doc => {
    const docLocale = doc.filePath.split('/')[1]
    return docLocale === resolvedParams.locale
  })
    .sort((a, b) => {
      // 首先处理 index.mdx
      if (a.filePath.endsWith('index.mdx')) return -1
      if (b.filePath.endsWith('index.mdx')) return 1

      // 获取文件路径部分
      const aPath = a.filePath.split('/').slice(2)  // 跳过第一个和locale部分
      const bPath = b.filePath.split('/').slice(2)

      // 比较文件夹前缀
      const aFolderNum = parseInt(aPath[0].match(/^(\d+)-/)?.[1] || '0')
      const bFolderNum = parseInt(bPath[0].match(/^(\d+)-/)?.[1] || '0')
      if (aFolderNum !== bFolderNum) {
        return aFolderNum - bFolderNum
      }

      // 如果是同一个文件夹，比较文件前缀
      const aFileNum = parseInt(aPath[1]?.match(/^(\d+)-/)?.[1] || '0')
      const bFileNum = parseInt(bPath[1]?.match(/^(\d+)-/)?.[1] || '0')
      return aFileNum - bFileNum
    })

  const docIndex = localeDocs.findIndex((d) => {
    // 从第2个元素开始拼接，跳过语言前缀
    const formattedDocSlug = formatSlug(d.slugAsParams.split('/').slice(1).join('/'))
    return formattedDocSlug === (resolvedParams.slug?.join('/') || 'index')
  })

  // 修正prev和next的获取逻辑
  const prev = docIndex > 0 ? localeDocs[docIndex - 1] : null
  const next = docIndex < localeDocs.length - 1 ? localeDocs[docIndex + 1] : null

  return (
    <div className="container relative">
      <div className="flex flex-col lg:flex-row ">
        {/* 主要内容区域 */}
        <article className="w-full lg:w-[calc(100%-250px)] ">
          {resolvedParams.slug?.length ? (
            <div className="mb-4">
              <DocBreadcrumb slug={resolvedParams.slug} />
            </div>
          ) : null}
          <DocHeading title={doc.title} description={doc.description} />
          {doc.related && <DocLinks links={doc.related as any} />}
          <div className="prose dark:prose-invert max-w-none">
            <MDXLayoutRenderer code={doc.body.code} components={components} />
          </div>
          <hr className="my-4 border-neutral-200 dark:border-neutral-800" />
          <DocsPager prev={prev} next={next} locale={resolvedParams.locale} />
        </article>

        {/* 右侧目录 */}
        <div className="hidden lg:block w-[250px] flex-shrink-0">
          <div className="sticky  overflow-y-auto pt-10">
            <TableOfContents toc={doc.toc as any} />
          </div>
        </div>
      </div>
    </div>
  )
}
