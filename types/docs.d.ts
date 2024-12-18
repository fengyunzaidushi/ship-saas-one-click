import { Doc as DocType } from 'contentlayer/generated'

interface TocItem {
  value: string
  url: string
  depth: number
}

interface Doc extends DocType {
  headings: TocItem[]
}

export type { Doc, TocItem } 