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
  params: {
    slug?: string[]
    locale: string
  }
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
  const slug = params.slug?.join('/') || ''
  const locale = params.locale

  // 添加类型断言
  const localeDocs = allDocs.filter(doc => {
    const docLocale = doc.filePath.split('/')[1]
    return docLocale === locale
  }) as Doc[]

  // 在过滤后的文档中查找，使用格式化后的路径进行比较
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
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams(params)
  if (!doc) {
    return {}
  }

  return genPageMetadata({
    title: doc.title,
    description: doc.description,
    params: { locale: params.locale },
  })
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams(params)

  if (!doc) {
    notFound()
  }

  // 添加类型断言
  const localeDocs = allDocs.filter(doc => {
    const docLocale = doc.filePath.split('/')[1]
    return docLocale === params.locale
  }) as Doc[]

  const docIndex = localeDocs.findIndex((d) => {
    const formattedDocSlug = formatSlug(d.slugAsParams)
    return formattedDocSlug === (params.slug?.join('/') || 'index')
  })

  const prev = localeDocs[docIndex - 1]
  const next = localeDocs[docIndex + 1]

  // 处理相关链接
  const relatedLinks = doc.related ? {
    ...doc.related,
    // 如果没有 href，使用 path
    href: (doc.related as any).href || (doc.related as any).path
  } : undefined

  return (
    <div className="flex">
      <article className="container relative max-w-3xl py-6 lg:py-10">
        {params.slug?.length ? <DocBreadcrumb slug={params.slug} /> : null}
        <DocHeading title={doc.title} description={doc.description} />
        <div className="prose dark:prose-invert max-w-none">
          <MDXLayoutRenderer code={doc.body.code} components={components} />
        </div>
        <hr className="my-4 border-neutral-200 dark:border-neutral-800" />
        {relatedLinks && <DocLinks links={relatedLinks} />}
        <DocsPager prev={prev} next={next} />
      </article>
      <TableOfContents toc={doc.headings} />
    </div>
  )
}
