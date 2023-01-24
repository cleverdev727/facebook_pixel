import { mount } from '@vue/test-utils'
import ArticlePreview from '@/components/lola/ArticlePreview.vue'
import articles from '../mocks/articles'
import { normalizeImageUrl } from '../../helpers/strings'

const article = articles[0]

const wrapper = mount(ArticlePreview, {
  propsData: {
    article
  },
  stubs: ['nuxt-link', 'nuxt-img']
})

const expectedBlogUrl = '/blog/periods'

describe('ArticlePreview.vue', () => {
  it('renders list container', () => {
    expect(wrapper).toBeTruthy()
    expect(wrapper.element.className).toBe('article-preview')
  })

  it('generates valid blogUrl', () => {
    expect(wrapper.vm.blogUrl).toBe(expectedBlogUrl)
  })

  it('generates valid articleUrl', () => {
    const expectedArticleUrl = `${expectedBlogUrl}/${article.handle}`
    expect(wrapper.vm.articleUrl).toBe(expectedArticleUrl)
  })

  it('generates valid image url and alt text', () => {
    const articleImageUrl = article.featuredMedia.fields.file.url
    const normalizedArticleImageUrl = normalizeImageUrl(articleImageUrl)
    const { url, alt } = wrapper.vm.image
    expect(url).toBe(normalizedArticleImageUrl)
    expect(alt).toBe(article.featuredMedia.fields.description)
  })

  it('use file title as alt text when file description is missing', async () => {
    const { featuredMedia } = article
    const { description, ...rest } = featuredMedia.fields
    const newArticle = {
      ...article,
      featuredMedia: {
        ...featuredMedia,
        fields: rest
      }
    }

    await wrapper.setProps({ article: newArticle })
    const { alt } = wrapper.vm.image
    expect(alt).toBe(newArticle.featuredMedia.fields.title)
  })

  it('return empty valid image url when file is missing', async () => {
    const newArticle = { ...article, featuredMedia: {} }
    await wrapper.setProps({ article: newArticle })
    const { url } = wrapper.vm.image
    expect(url).toBe('')
  })

  it('test for featuredMedia and desktop image when article is null', async () => {
    const newArticle = {
      ...article,
      featuredMedia: null,
      featuredImageDesktop: null
    }
    await wrapper.setProps({ article: newArticle })
    expect(wrapper.vm.image).toEqual({ url: '', alt: '' })
  })

  it('generates valid image url when featuredmedia is missing', async () => {
    const { featuredMedia, ...rest } = article
    await wrapper.setProps({ article: rest })
    const articleImageUrl = article.featuredImageDesktop.fields.file.url
    const normalizedArticleImageUrl = normalizeImageUrl(articleImageUrl)
    const { url } = wrapper.vm.image
    expect(url).toBe(normalizedArticleImageUrl)
  })

  it('test for featuredMedia and desktop image when article is null', async () => {
    const newArticle = null
    await wrapper.setProps({ article: newArticle })
    expect(wrapper.vm.image).toEqual({ url: '', alt: '' })
  })
})
