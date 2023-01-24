import { mount } from '@vue/test-utils'
import { buildArticleData } from '@/helpers/blog'
import articles from '@/tests/mocks/articles'
import { normalizeImageUrl } from '@/helpers/strings'
import { getFlattenedFeaturedMedia } from '@/utils/contentful.util'
import BlogArticle from '../../components/lola/BlogArticle.vue'

const article = buildArticleData(articles[0])
const $route = {
  params: {
    articleHandle: 'another-summer-article',
    blogHandle: 'periods'
  },
  path: '/blog/periods/another-summer-article'
}

const getWrapper = (mountOptions = {}) => {
  let defaultData = {
    activeTab: 'all'
  }

  const { data, ...rest } = mountOptions
  const options = {
    attachTo: document.body,
    stubs: ['articles-preview', 'nuxt-img', 'nuxt-link', 'you-might-like'],
    mocks: { $route }
  }

  if (data) {
    defaultData = { ...defaultData, ...data }
  }

  options.data = function () {
    return defaultData
  }

  return mount(BlogArticle, { ...options, ...rest })
}

describe('BlogArticle', () => {
  it('renders article component', () => {
    const wrapper = getWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders nothing when article is null', () => {
    const wrapper = getWrapper()
    expect(wrapper.vm.images).toBeNull()
  })

  it('displays article when provided', () => {
    const wrapper = getWrapper({ propsData: { article } })
    const container = wrapper.find('article.article')
    expect(container.exists()).toBe(true)
  })

  it('displays related articles when provided', () => {
    const wrapper = getWrapper({ propsData: { article } })
    const previews = wrapper.findAll('.article-preview')
    expect(previews.length).toBe(article.relatedArticles.length)
  })

  it('generates correct breadcrumbs', () => {
    const wrapper = getWrapper({ propsData: { article } })
    const breadcrumbs = wrapper.vm.breadcrumbs
    expect(breadcrumbs.length).toBe(3)
    expect(breadcrumbs[1].text).toBe('blog')
    expect(breadcrumbs[2].text).toBe('periods')
    expect(breadcrumbs[2].link).toBe('/blog/periods')
  })

  describe('Computed image', () => {
    const wrapper = getWrapper({ propsData: { article } })

    it('uses featured desktop image if it exists', () => {
      const images = wrapper.vm.images
      expect(images.desktop.url).toBe(
        normalizeImageUrl(article.featuredImageDesktop.fields.file.url)
      )
    })

    it('uses featured media if featured desktop image does not exist', () => {
      const { featuredImageDesktop, ...rest } = article
      const wrapper = getWrapper({
        propsData: { article: rest }
      })
      const images = wrapper.vm.images
      const { url, alt } = getFlattenedFeaturedMedia(article.featuredMedia)
      expect(images.desktop.url).toBe(normalizeImageUrl(url))
      expect(images.desktop.altText).toBe(alt)
    })

    it('return nothing if neither of featured desktop image or featured media exists', () => {
      const { featuredImageDesktop, featuredMedia, ...rest } = article
      const wrapper = getWrapper({
        propsData: { article: rest }
      })
      const images = wrapper.vm.images
      expect(images).toBeNull()
    })
  })
})
