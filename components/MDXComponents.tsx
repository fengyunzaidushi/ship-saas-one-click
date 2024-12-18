import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import NextImage from 'next/image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

const Image = ({ srcLight, srcDark, ...props }: any) => {
  // 使用 srcLight 作为默认图片源
  const src = srcLight || srcDark || props.src
  
  // 确保路径以 / 开头
  const imageSrc = src.startsWith('/') ? src : `/${src}`
  
  return (
    <div className="my-6">
      <NextImage
        {...props}
        src={imageSrc}
        alt={props.alt || ''}
        className="rounded-lg"
      />
    </div>
  )
}

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
}
