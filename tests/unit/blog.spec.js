import { mount } from '@vue/test-utils'
import blogs from '@/tests/mocks/blogs'
import Blog from '../../components/lola/Blog.vue'

const getWrapper = (mountOptions = {}) => {
  let defaultData = {
    activeTab: 'all'
  }

  const { data, ...rest } = mountOptions
  const options = {
    attachTo: document.body,
    stubs: ['articles-list']
  }

  if (data) {
    defaultData = { ...defaultData, ...data }
  }

  options.data = function () {
    return defaultData
  }

  return mount(Blog, { ...options, ...rest })
}

describe('Blog.vue', () => {
  it('renders blog component', () => {
    const wrapper = getWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays nothing when blog prop is empty', () => {
    const wrapper = getWrapper()
    const container = wrapper.find('.blog-container')
    expect(container.exists()).toBe(false)

    const data = wrapper.vm.data
    expect(data).toStrictEqual({})
  })

  it('sets active tab', async () => {
    const wrapper = getWrapper({ propsData: { blog: blogs[0] } })
    const tabs = wrapper.findAll('.blog-tags .tag.text--blue')
    const lastIndex = tabs.length - 1

    await tabs.at(lastIndex).trigger('click')

    const activeTab = wrapper.vm.activeTab
    expect(activeTab).toBe(wrapper.vm.data.tags[lastIndex])
  })
})
