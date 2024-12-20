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

interface DocPageProps {
  params: {
    slug?: string[]
    locale: string
  }
}

async function getDocFromParams(params: DocPageProps['params']) {
  const slug = params.slug?.join('/') || ''
  const locale = params.locale
  
  // 过滤当前语言的文档
  const localeDocs = allDocs.filter(doc => {
    const docLocale = doc.path.split('/')[1]
    return docLocale === locale
  })
  
  // 在过滤后的文档中查找
  const doc = localeDocs.find((doc) => 
    slug === '' 
      ? doc.slugAsParams === 'index'
      : doc.slugAsParams === slug
  )

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

  // 在当前语言的文档中查找前后文档
  const localeDocs = allDocs.filter(doc => {
    const docLocale = doc.path.split('/')[1]
    return docLocale === params.locale
  })

  const docIndex = localeDocs.findIndex(
    (d) => d.slugAsParams === (params.slug?.join('/') || 'index')
  )
  
  const prev = localeDocs[docIndex + 1]
  const next = localeDocs[docIndex - 1]

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      {params.slug?.length ? <DocBreadcrumb slug={params.slug} /> : null}
      <DocHeading title={doc.title} description={doc.description} />
      {doc.related && <DocLinks links={doc.related as any} />}
      <div className="prose dark:prose-invert max-w-none">
        <MDXLayoutRenderer code={doc.body.code} components={components} />
      </div>
      <hr className="my-4 border-neutral-200 dark:border-neutral-800" />
      <DocsPager prev={prev} next={next} locale={params.locale} />
    </article>
  )
}
