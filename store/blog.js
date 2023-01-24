import { getClient, getConfig } from '../utils/cms.util'
import { getBlogArticles } from '../helpers/blog'

const contentfulConfig = getConfig('contentful')
const nacelleConfig = getConfig('nacelle')

export const state = () => ({
  blogs: {},
  config: {
    contentful: contentfulConfig,
    nacelle: nacelleConfig
  }
})

export const actions = {
  async getBlog({ state }, handle) {
    const client = getClient('nacelle')(state.config.nacelle)
    const blog = state.blogs[handle]
    if (blog) return blog

    try {
      const blog = await client.data.blog({ handle })
      state.blogs[handle] = blog
      return blog
    } catch (error) {
      console.error(error)
      console.warn(`No blog with handle: '${handle}' found`)
    }
  },

  async getBlogArticles({ state }, options) {
    const client = getClient('contentful')(state.config.contentful)
    const result = await getBlogArticles(client, options)
    return result
  }
}

export default {
  namespaced: true,
  actions,
  state
}
