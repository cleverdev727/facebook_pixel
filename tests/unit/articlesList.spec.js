import { mount } from '@vue/test-utils'
import ArticlesList from '@/components/lola/ArticlesList.vue'
import ArticlePreview from '@/components/lola/ArticlePreview.vue'
import articles from '../mocks/articles'

const wrapper = mount(ArticlesList, {
  stubs: ['article-preview']
})

describe('ArticlesList.vue', () => {
  it('renders list container', () => {
    expect(wrapper).toBeTruthy()
    expect(wrapper.element.className).toBe('articles-list')
  })

  it('renders no previews if "articles" prop is missing', () => {
    const cards = wrapper.findAllComponents(ArticlePreview)
    expect(cards.length).toBe(0)
  })

  it('renders previews when "articles" prop is non-empty', async () => {
    await wrapper.setProps({ articles })
    const cards = wrapper.findAllComponents(ArticlePreview)
    expect(cards.length).toBe(articles.length)
  })
})
