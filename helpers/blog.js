export const buildArticleData = ({ fields = {}, author, ...rest }) => {
  // Nacelle data has inconsistent structure across APIs.
  // If field keys contain non-null data, they should
  // be moved up into the parent object for consistency.
  Object.keys(fields).forEach((key) => {
    const data = fields[key]
    if (data) {
      rest[key] = data
    }
  })
  const { bestsellerProducts } = rest

  /* Nacelle attaches author object directly,
   ** if we are fetching from Contentful, then
   ** we have to manually convert to the
   ** nacelle structure
   */
  if (author) {
    // Contentful?
    if (author.fields) {
      const { firstName, lastName } = author.fields
      author = {
        firstName,
        lastName
      }
    }
  } else {
    const { firstName, lastName } = fields.author.fields
    author = { firstName, lastName }
  }
  const bestSellerTabs = bestsellerProducts?.fields?.tabs || []
  const handles = bestSellerTabs.reduce((allHandles, tab) => {
    const { products } = tab.fields
    const handles = products.map(
      (product) => product.fields.handle.split('::')[0]
    )
    allHandles = [...allHandles, ...handles]
    return allHandles
  }, [])
  return {
    ...rest,
    author,
    bestsellers: handles
  }
}

export const getBlogArticles = async (
  client,
  {
    blogHandle,
    excludeHandles = [],
    limit = 10,
    orderBy = 'fields.publishDate'
  }
) => {
  const result = await client.getEntries({
    content_type: 'article',
    'fields.blogHandle[match]': blogHandle,
    'fields.handle[nin]': excludeHandles.join(','),
    limit,
    order: orderBy
  })

  return result
}

export const getBlogCategories = async (client) => {
  const result = await client.getEntries({
    content_type: 'blog',
    order: 'fields.title',
    select: 'fields.title,fields.description,fields.icon,fields.handle'
  })

  return result
}

export const getLatestArticles = async (
  client,
  { excludeHandles = [], limit = 10, orderBy = 'fields.publishDate' }
) => {
  const result = await client.getEntries({
    content_type: 'article',
    'fields.handle[nin]': excludeHandles.join(','),
    limit,
    order: orderBy
  })

  return result
}
