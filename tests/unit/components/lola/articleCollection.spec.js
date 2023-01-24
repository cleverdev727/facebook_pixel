import ArticleCollection from '@/components/lola/ArticleCollection.vue'
import ArticlesList from '@/components/lola/ArticlesList.vue'
import { TestWrapperBuilder } from '../../../../utils/tests.util'
import articles from './../../../mocks/articles'

const wrapperBuilder = TestWrapperBuilder(ArticleCollection, {
  propsData: {
    articles: articles.slice(0, 2)
  },
  stubs: ['articles-list']
})

describe('ArticleCollection.vue', () => {
  const wrapper = wrapperBuilder.build()

  it('renders article collection', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.article-collection').exists()).toBe(true)
  })

  it('renders articles list', () => {
    const list = wrapper.findComponent(ArticlesList)
    expect(list.exists()).toBe(true)
  })

  it('does not render articles list when article prop is missing', async () => {
    await wrapper.setProps({ articles: null })
    const list = wrapper.findComponent(ArticlesList)
    expect(wrapper.vm.articlesList).toBeNull()
    expect(list.exists()).toBe(false)
  })
})
