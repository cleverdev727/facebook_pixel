import { shallowMount } from '@vue/test-utils'
import ProgressBar from '@/components/lola/ProgressBar'

const defaultProps = {
  value: 0
}

describe('progressbar', () => {
  it('renders progressbar', () => {
    const wrapper = shallowMount(ProgressBar, {
      propsData: defaultProps
    })
    expect(wrapper.classes('progress')).toBe(true)
    expect(wrapper.find('.progress-bar').exists()).toBe(true)
  })

  it('contains correct ARIA values', () => {
    const wrapper = shallowMount(ProgressBar, {
      propsData: { maxValue: 100, ...defaultProps }
    })

    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
  })

  it('renders bar with correct width', async () => {
    const wrapper = shallowMount(ProgressBar, {
      propsData: {
        currentValue: 25,
        maxValue: 100,
        ...defaultProps
      }
    })

    const bar = wrapper.find('.progress-bar')
    wrapper.element.style.width = '300px'
    const parentWidth = wrapper.element.clientWidth
    const barWidth = bar.element.clientWidth

    await wrapper.vm.$nextTick()

    expect(barWidth).toBeCloseTo(parentWidth * (25 / 100))
  })
})
