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
import { Doc } from '@/types/docs'

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

  const docIndex = localeDocs.findIndex((d) => {
    const formattedDocSlug = formatSlug(d.slugAsParams)
    return formattedDocSlug === (resolvedParams.slug?.join('/') || 'index')
  })

  const prev = localeDocs[docIndex + 1]
  const next = localeDocs[docIndex - 1]

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
          <DocsPager prev={prev} next={next} />
        </article>

        {/* 右侧目录 */}
        <div className="hidden lg:block w-[250px] flex-shrink-0">
          <div className="sticky  overflow-y-auto pt-10">
            <TableOfContents toc={doc.toc || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
