import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 5

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params
  return genPageMetadata({ title: 'Blog', params: resolvedParams })
}

// 封装获取博客文章的异步函数
async function fetchLocalePosts(locale: string) {
  try {
    const posts = allCoreContent(
      sortPosts(
        allBlogs.filter((post) => post.locale === locale)
      )
    )
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// 计算分页数据
function getPaginationData(posts: any[], pageNumber: number) {
  if (!Array.isArray(posts)) {
    return {
      initialDisplayPosts: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
      }
    }
  }

  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )

  return {
    initialDisplayPosts,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
    }
  }
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  try {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams
    const posts = await fetchLocalePosts(resolvedParams.locale)
    const { initialDisplayPosts, pagination } = getPaginationData(posts, 1)

    return (
      <ListLayout
        posts={posts}
        title="All Posts"
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        locale={resolvedParams.locale}
      />
    )
  } catch (error) {
    console.error('Error in BlogPage:', error)
    return <div>Error loading blog posts</div>
  }
}