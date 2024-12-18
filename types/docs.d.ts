import { Doc as ContentLayerDoc } from 'contentlayer/generated'

export interface TocItem {
  value: string
  depth: number
  url: string
}

export interface Doc extends ContentLayerDoc {
  title: string
  description?: string
  body: { code: string }
  toc: TocItem[]
  path: string
  related?: { title: string; href: string }[]
  filePath: string
  slugAsParams: string
}

export type { Doc, TocItem } 