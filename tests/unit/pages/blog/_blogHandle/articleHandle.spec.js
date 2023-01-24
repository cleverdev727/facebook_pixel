import Vue from 'vue'
import Vuex from 'vuex'
import { mount } from '@vue/test-utils'
import storeConfig from '@/tests/storeConfig'
import ArticleHandle from '@/pages/blog/_blogHandle/_articleHandle.vue'
import { buildArticleData } from '@/helpers/blog'
import articles from '@/tests/mocks/articles'

const article = articles[0]
const $nacelle = {
  data: { article: jest.fn() }
}

$nacelle.data.article.mockResolvedValueOnce(article)

Vue.use(Vuex)

const $route = {
  params: {
    articleHandle: 'another-summer-article',
    blogHandle: 'periods'
  },
  path: '/blog/periods/another-summer-article'
}

const store = new Vuex.Store(storeConfig())

const getWrapper = (mountOptions = {}) => {
  const { data, ...rest } = mountOptions
  const options = {
    attachTo: document.body,
    store,
    stubs: ['nuxt-link', 'nuxt-img', 'you-might-like']
  }

  if (data) {
    options.data = function () {
      return { ...data }
    }
  }

  return mount(ArticleHandle, {
    ...options,
    ...rest,
    mocks: { $nacelle, $route }
  })
}

const wrapper = getWrapper({
  data: {
    article: null,
    loading: false,
    showBestsellers: false
  }
})

describe('pages/blog/_blogHandle/ArticleHandle.vue', () => {
  const pageArticle = buildArticleData(article)

  it('renders article page', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.page).toBe(wrapper.vm.article)
  })

  it("show nothing when there's no article", () => {
    expect(wrapper.find('article.article').exists()).toBe(false)
  })

  it('show loader when page is loading content', async () => {
    await wrapper.setData({ loading: true })
    expect(wrapper.find('.lds-dual-ring').exists()).toBe(true)
  })

  it('shows loaded article', async () => {
    await wrapper.setData({ article: pageArticle, loading: false })
    expect(wrapper.find('article.article').exists()).toBe(true)
  })

  it('fetches articles from nacelle', async () => {
    const wrapper = getWrapper({
      data: {
        article: null,
        loading: false,
        showBestsellers: false
      }
    })

    await ArticleHandle.fetch.call(wrapper.vm)
    expect($nacelle.data.article).toHaveBeenCalled()
    const { articleHandle, blogHandle } = $route.params
    expect($nacelle.data.article).toHaveBeenCalledWith({
      handle: articleHandle,
      blogHandle: blogHandle.toLowerCase()
    })
    const pageArticle = buildArticleData(article)
    expect(wrapper.vm.article).toStrictEqual(pageArticle)
  })

  it('does nothing when fetching article fails', async () => {
    $nacelle.data.article.mockRejectedValueOnce()

    const wrapper = getWrapper({
      data: {
        article: null,
        loading: false,
        showBestsellers: false
      }
    })
    await ArticleHandle.fetch.call(wrapper.vm)
    expect(wrapper.vm.article).toBeNull()
  })
})
