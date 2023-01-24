import { createLocalVue, shallowMount } from '@vue/test-utils'

import ArrowRight from '@/components/lola/icons/ArrowRight.vue'

const localVue = createLocalVue()

describe('ArrowRight.vue', () => {
  it('displays the icon with defaults', () => {
    const wrapper = shallowMount(ArrowRight, {
      localVue
    })
    expect(wrapper.find('svg').attributes('stroke')).toBe('none')
    expect(wrapper.find('path').attributes('fill')).toBe('#514945')
  })

  it('displays the icon with props', () => {
    const wrapper = shallowMount(ArrowRight, {
      localVue,
      propsData: {
        color: '#4e6282',
        stroke: 'blue'
      }
    })
    expect(wrapper.find('svg').attributes('stroke')).toBe('blue')
    expect(wrapper.find('path').attributes('fill')).toBe('#4e6282')
  })
})
