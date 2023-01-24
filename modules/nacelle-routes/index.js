import client from './client'
import getProductRoutes from './getProductRoutes'
import getCollectionRoutes from './getCollectionRoutes'

const productRoutePath = '/products/'
const collectionRoutePath = '/collections/'
const pageRoutePath = '/pages/'
const blogRoutePath = '/blog/'

export default function generateRoutes() {
  this.nuxt.hook('generate:before', async (_generator, generateOptions) => {
    const allContent = (await client.data.allContent()) || []
    const articles = []
    const blogs = []
    const pages = []

    allContent.forEach(({ type, handle, blogHandle }) => {
      if (type === 'article') {
        articles.push(`${blogRoutePath}${blogHandle}/${handle}`)
      } else if (type === 'blog') {
        blogs.push(`${blogRoutePath}${handle}`)
      } else if (type === 'page') {
        pages.push(`${pageRoutePath}${handle}`)
      }
    })

    pages.push('account/search')

    const routesArrays = await Promise.all([
      getProductRoutes(productRoutePath),
      getCollectionRoutes(collectionRoutePath),
      pages,
      articles,
      blogs,
      ['/collections']
    ])

    const nacelleRoutes = routesArrays.reduce((acc, curr) => {
      return acc.concat(curr)
    }, [])

    generateOptions.routes.push(...nacelleRoutes)
  })
}
