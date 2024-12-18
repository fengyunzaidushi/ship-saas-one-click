import { Metadata } from 'next'

interface PageMetadataProps {
  title: string
  description?: string
  image?: string
  params: {
    locale: string
  }
}

export function genPageMetadata({
  title,
  description,
  image,
  params: { locale },
}: PageMetadataProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
} 