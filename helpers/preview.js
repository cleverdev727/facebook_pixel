import { ARTICLES_LIMIT } from '@/pages/blog/_blogHandle/index.vue'
import { getBlogArticles } from './blog'

export const buildBlogData = async (client, { fields = {}, ...rest }) => {
  // Nacelle data has inconsistent structure across APIs.
  // If field keys contain non-null data, they should
  // be moved up into the parent object for consistency.
  Object.keys(fields).forEach((key) => {
    const data = fields[key]
    if (data) {
      rest[key] = data
    }
  })

  let featuredArticles = fields.featuredArticles || []

  // Load more if featured articles are less than 10
  const fetched = featuredArticles.length
  if (fetched < ARTICLES_LIMIT) {
    const handle = fields.handle
    const excludedHandles = featuredArticles
      .map((x) => x.fields.handle)
      .join(',')
    const { items: articles } = await getBlogArticles(client, {
      blogHandle: handle,
      excludedHandles,
      limit: ARTICLES_LIMIT - fetched
    })

    featuredArticles = [...featuredArticles, ...articles]
  }

  fields.featuredArticles = featuredArticles
  return {
    ...rest,
    fields
  }
}
