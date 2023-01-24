import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import BlogLandingPage from '@/pages/blog/Index.vue'
import { TestWrapperBuilder } from '../../../../utils/tests.util'
import blogLandingPage from '../../../mocks/pages/blog-landing-page'

const consoleErrorSpy = jest.spyOn(console, 'error')
const consoleWarnSpy = jest.spyOn(console, 'warn')
const mockStoreConfig = {
  modules: {
    events: {
      namespaced: true,
      actions: {
        pageView: jest.fn()
      }
    }
  }
}
const localVue = createLocalVue()
localVue.use(Vuex)
const store = new Vuex.Store(mockStoreConfig)
const getEntriesMockFn = jest
  .fn()
  .mockResolvedValueOnce({ items: [blogLandingPage] })
  .mockResolvedValueOnce({ items: [] })
  .mockRejectedValueOnce(new Error('Error'))

const $contentful = { getEntries: getEntriesMockFn }
const $route = { path: '/blog' }
const wrapperBuilder = TestWrapperBuilder(BlogLandingPage, {
  localVue,
  stubs: ['page-content'],
  store,
  mocks: { $contentful, $route }
})

describe('pages/blog/index.vue', () => {
  it('render preview page', () => {
    const wrapper = wrapperBuilder.build()
    expect(wrapper.exists()).toBe(true)
  })

  it('set page value after fetching from contentful', async () => {
    const wrapper = wrapperBuilder.build()
    await BlogLandingPage.fetch.call(wrapper.vm)
    expect(getEntriesMockFn).toHaveBeenCalled()
    expect(wrapper.vm.page).toStrictEqual(blogLandingPage.fields)
  })

  it('does nothing when page is not found.', async () => {
    const wrapper = wrapperBuilder.build()
    await BlogLandingPage.fetch.call(wrapper.vm)
    expect(wrapper.vm.page).toBeNull()
    expect(consoleWarnSpy).toHaveBeenCalled()
  })

  it('does nothing when fetching fails', async () => {
    const wrapper = wrapperBuilder.build()
    await BlogLandingPage.fetch.call(wrapper.vm)
    expect(wrapper.vm.page).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})
