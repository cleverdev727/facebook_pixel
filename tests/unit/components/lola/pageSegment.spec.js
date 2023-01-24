import { shallowMount } from '@vue/test-utils'
import PageSegment from '@/components/lola/PageSegment.vue'
import pageSegments from './../../../mocks/page-segments'

const getWrapper = (mountOptions = {}) => {
  let defaultData = {}

  const { data, ...rest } = mountOptions
  const options = {
    attachTo: document.body,
    stubs: ['page-content']
  }

  if (data) {
    defaultData = { ...defaultData, ...data }
  }

  options.data = function () {
    return defaultData
  }

  const wrapper = shallowMount(PageSegment, { ...options, ...rest })

  return wrapper
}

describe('PageSegment.vue', () => {
  const segment = pageSegments[0]

  it('renders page segment', () => {
    const wrapper = getWrapper({
      propsData: { ...segment }
    })
    const title = wrapper.find('h3')
    const button = wrapper.find('.button')
    expect(wrapper.exists()).toBe(true)
    expect(title.text()).toBe(segment.title)
    expect(button.text()).toBe(segment.ctaText)
    expect(button.attributes('href')).toBe(segment.ctaUrl)
  })

  describe('computed page', () => {
    const wrapper = getWrapper({
      propsData: { ...segment }
    })

    it('returns a single section when content is an object', () => {
      expect(Array.isArray(wrapper.vm.page.sections)).toBe(true)
      expect(wrapper.vm.page.sections.length).toBe(1)
    })

    it('returns empty sections when content is missing', async () => {
      await wrapper.setProps({ ...segment, content: null })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.page.sections.length).toBe(0)
    })

    it('returns an array of sections when content is an array', async () => {
      const { content, ...newSegment } = segment
      const contents = Array(3)
        .fill(0)
        .map((x) => ({ ...content }))
      await wrapper.setProps({ ...newSegment, content: contents })
      expect(wrapper.vm.page.sections.length).toBe(3)
    })
  })
})
