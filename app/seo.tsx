import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  params?: {
    locale: string
  }
  alternates?: {
    canonical?: string
    types?: {
      [key: string]: string
    }
  }
}

export function genPageMetadata({ 
  title, 
  description, 
  image,
  params,
  alternates,
  ...rest 
}: PageSEOProps): Metadata {
  const finalDescription = description || siteMetadata.description
  
  return {
    title: `${title} | ${siteMetadata.title}`,
    description: finalDescription,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: finalDescription,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: params?.locale || 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    alternates: alternates || {
      canonical: '/',
    },
    ...rest,
  }
}
