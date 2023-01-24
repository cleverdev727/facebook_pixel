import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BlogCollectionPage from '@/pages/blog/_blogHandle/index.vue'
import blogs, { blogArticles } from '@/tests/mocks/blogs'

import { TestWrapperBuilder } from '../../../../../utils/tests.util'

const localVue = createLocalVue()
localVue.use(Vuex)

const loadMoreSpy = jest.spyOn(BlogCollectionPage.methods, 'loadMore')
const getBlogMockFn = jest.fn()
const getBlogArticlesMockFn = jest.fn()
const getEntriesMockFn = jest
  .fn()
  .mockResolvedValue({ items: blogArticles.slice(0, 3), total: 3 })
const mockStoreConfig = {
  modules: {
    blog: {
      namespaced: true,
      actions: {
        getBlog: getBlogMockFn,
        getBlogArticles: getBlogArticlesMockFn
      }
    },
    events: {
      namespaced: true,
      actions: {
        blogView: jest.fn()
      }
    }
  }
}

const store = new Vuex.Store(mockStoreConfig)
const $route = {
  params: {
    blogHandle: 'periods'
  },
  path: '/blog/periods'
}
const $contentful = { getEntries: getEntriesMockFn }
const wrapperBuilder = TestWrapperBuilder(BlogCollectionPage, {
  attachTo: document.body,
  localVue,
  store,
  stubs: ['nuxt-link', 'nuxt-img'],
  mocks: { $route, $contentful }
})

const getWrapper = (mountOptions = {}) => {
  let defaultData = {
    canLoadMore: true,
    blog: null,
    fetched: 0,
    loading: false
  }

  const { data, ...rest } = mountOptions
  const options = {
    attachTo: document.body,
    localVue,
    store,
    stubs: ['nuxt-link', 'nuxt-img'],
    mocks: { $route }
  }

  if (data) {
    defaultData = { ...defaultData, ...data }
  }

  options.data = function () {
    return defaultData
  }

  return shallowMount(BlogCollectionPage, { ...options, ...rest })
}

describe('pages/blog/_blogHandle/Index.vue', () => {
  afterEach(() => jest.clearAllMocks())

  it('render blog category page', () => {
    const wrapper = getWrapper()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.page).toBe(wrapper.vm.blog)
  })

  it('do nothing if blog is not found', async () => {
    getBlogMockFn.mockResolvedValueOnce(null)
    const wrapper = getWrapper()

    await BlogCollectionPage.fetch.call(wrapper.vm)
    expect(wrapper.vm.blog).toBeNull()
    const result = await wrapper.vm.loadMore()
    expect(result).toBeFalsy()
  })

  it('do nothing if fetching articles fails', async () => {
    getBlogMockFn.mockRejectedValueOnce(new Error('Error'))
    const wrapper = getWrapper()

    await BlogCollectionPage.fetch.call(wrapper.vm)
    expect(wrapper.vm.blog).toBeNull()
    expect(wrapper.vm.articleHandles).toStrictEqual([])
  })

  it('do nothing if loading more articles fails', async () => {
    getBlogArticlesMockFn.mockRejectedValue(3)
    const wrapper = getWrapper()

    await BlogCollectionPage.fetch.call(wrapper.vm)
    expect(wrapper.vm.fetched).toBe(0)
  })

  describe('fetch blog', () => {
    getBlogMockFn.mockResolvedValue(blogs[0])
    const _blogArticles = blogArticles.slice(0, 3)

    getBlogArticlesMockFn.mockResolvedValue({
      items: _blogArticles,
      total: 20
    })

    const wrapper = getWrapper()

    it('fetches blog and displays it', async () => {
      await BlogCollectionPage.fetch.call(wrapper.vm)
      expect(getBlogMockFn).toHaveBeenCalled()
      expect(getBlogArticlesMockFn).toHaveBeenCalled()
      const blog = await getBlogMockFn.mock.results[0].value
      expect(wrapper.vm.page).toBe(wrapper.vm.blog)
      expect(wrapper.vm.blog.title).toBe(blog.title)
      await loadMoreSpy.mock.results[0].value
      expect(wrapper.vm.canLoadMore).toBe(true)
    })

    it('do nothing when no article is returned', async () => {
      getBlogArticlesMockFn.mockResolvedValue({
        items: [],
        total: 0
      })
      const wrapper = getWrapper()

      await BlogCollectionPage.fetch.call(wrapper.vm)
      expect(loadMoreSpy).toHaveBeenCalledTimes(1)
      const result = await loadMoreSpy.mock.results[0].value
      expect(result).toBe(false)
      expect(wrapper.vm.fetched).toBe(0)
    })

    it('disables load-more button if articles fetched exceed total', async () => {
      const _blogArticles = blogArticles.slice(0, 5)
      getBlogArticlesMockFn.mockResolvedValue({
        items: _blogArticles,
        total: 3
      })
      const wrapper = getWrapper()
      await BlogCollectionPage.fetch.call(wrapper.vm)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.canLoadMore).toBe(false)
      const button = wrapper.find('button')
      expect(button.element).toBeDisabled()
    })
    it('also fetches latest articles', async () => {
      const route = $route
      route.params.blogHandle = 'latest'
      wrapperBuilder.setOptions({ mocks: { $route: route, $contentful } })
      const wrapper = wrapperBuilder.build()
      await BlogCollectionPage.fetch.call(wrapper.vm)
      await wrapper.vm.$nextTick()
      expect(getEntriesMockFn).toHaveBeenCalled()
      expect(wrapper.vm.blog.title).toBe('Latest blog posts')
      // Since we are only returning 3 items, which is less
      // than ARTICLES_LIMIT (10), loadMore must have been called,
      // which in turn calls `getEntries` and receives another 3 items
      expect(wrapper.vm.blog.fields.featuredArticles.length).toBe(6)
    })
  })
})
