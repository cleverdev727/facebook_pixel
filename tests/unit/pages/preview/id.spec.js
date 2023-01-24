import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Blog from '@/components/lola/Blog.vue'
import BlogArticle from '@/components/lola/BlogArticle.vue'
import NacelleComponentPlaceholder from '@/components/nacelle/NacelleComponentPlaceholder.vue'
import PreviewPage from '@/pages/preview/_id.vue'
import articles from '@/tests/mocks/articles'
import blogs from '@/tests/mocks/blogs'
import { buildArticleData } from '@/helpers/blog'
import { buildBlogData } from '~/helpers/preview'

jest.mock('@/helpers/blog', () => {
  return {
    _esModule: true,
    ...jest.requireActual('@/helpers/blog'),
    buildArticleData: jest.fn()
  }
})

jest.mock('@/helpers/preview', () => {
  return {
    _esModule: true,
    ...jest.requireActual('@/helpers/preview'),
    buildBlogData: jest.fn()
  }
})

const getContentTypeMetadata = (type) => {
  return {
    sys: {
      contentType: {
        sys: {
          id: type
        }
      }
    }
  }
}

const article = { ...articles[0], ...getContentTypeMetadata('article') }
const blog = { ...blogs[0], ...getContentTypeMetadata('blog') }
const unidentifiedEntry = { ...getContentTypeMetadata('-----') }

const localVue = createLocalVue()

localVue.component('Blog', Blog)
localVue.component('BlogArticle', BlogArticle)
localVue.component('NacelleComponentPlaceholder', NacelleComponentPlaceholder)
localVue.use(Vuex)

const getEntryMockFn = jest
  .fn()
  .mockResolvedValueOnce({ items: [article] })
  .mockResolvedValueOnce({ items: [blog] })
  .mockResolvedValueOnce({ items: [unidentifiedEntry] })
  .mockResolvedValueOnce({ items: [] })
  .mockRejectedValueOnce(new Error('Error'))

const $preview = { getEntries: getEntryMockFn }
const $route = {
  params: {
    id: 'sample_id'
  }
}

const getWrapper = (mountOptions = {}) => {
  let defaultData = {
    content: null,
    contentType: null
  }

  const { data, ...rest } = mountOptions
  const options = {
    attachTo: document.body,
    localVue,
    mocks: { $route, $preview },
    stubs: ['component']
  }

  if (data) {
    defaultData = { ...defaultData, ...data }
  }

  options.data = function () {
    return defaultData
  }

  const wrapper = shallowMount(PreviewPage, { ...options, ...rest })

  return wrapper
}

describe('pages/preview/_id.vue', () => {
  it('render preview page', () => {
    const wrapper = getWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders an article', async () => {
    const wrapper = getWrapper()

    await PreviewPage.fetch.call(wrapper.vm)
    expect(buildArticleData).toHaveBeenCalled()
    const contentType = wrapper.vm.contentType
    expect(wrapper.vm.getComponentDefinition(contentType)).toBe('BlogArticle')
  })

  it('renders a blog category', async () => {
    const wrapper = getWrapper()

    await PreviewPage.fetch.call(wrapper.vm)

    const contentType = wrapper.vm.contentType

    expect(buildBlogData).toHaveBeenCalled()
    expect(wrapper.vm.getComponentDefinition(contentType)).toBe('blog')
  })

  it('set default content', async () => {
    const wrapper = getWrapper()

    await PreviewPage.fetch.call(wrapper.vm)

    const contentType = wrapper.vm.contentType

    expect(wrapper.vm.content).toBe(unidentifiedEntry)
    expect(wrapper.vm.getComponentDefinition(contentType)).toBe(
      'NacelleComponentPlaceholder'
    )
  })

  it('do nothing if content not found', async () => {
    const wrapper = getWrapper()
    const result = await PreviewPage.fetch.call(wrapper.vm)
    expect(result).toBeFalsy()
  })

  it('do nothing if fetching content fails', async () => {
    const wrapper = getWrapper()
    await PreviewPage.fetch.call(wrapper.vm)
    expect(wrapper.vm.content).toBeNull()
    expect(wrapper.vm.getComponentDefinition()).toBe(
      'NacelleComponentPlaceholder'
    )
  })
})
