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
import { genPageMetadata } from 'app/seo'

interface DocPageProps {
  params: {
    slug?: string[]
    locale: string
  }
}

async function getDocFromParams(params: DocPageProps['params']) {
  const slug = params.slug?.join('/') || ''
  // 如果没有 slug，返回索引文档
  const doc = allDocs.find((doc) => 
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

  // Find the index of current doc
  const docIndex = allDocs.findIndex(
    (d) => d.slugAsParams === (params.slug?.join('/') || 'index')
  )
  const prev = allDocs[docIndex + 1]
  const next = allDocs[docIndex - 1]

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      {params.slug?.length ? <DocBreadcrumb slug={params.slug} /> : null}
      <DocHeading title={doc.title} description={doc.description} />
      {doc.related && <DocLinks links={doc.related} />}
      <div className="prose dark:prose-invert max-w-none">
        <MDXLayoutRenderer code={doc.body.code} components={components} />
      </div>
      <hr className="my-4 border-neutral-200 dark:border-neutral-800" />
      <DocsPager prev={prev} next={next} />
    </article>
  )
}
