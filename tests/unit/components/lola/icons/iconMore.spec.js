import { createLocalVue, shallowMount } from '@vue/test-utils'

import IconMore from '@/components/lola/icons/IconMore.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(IconMore, {
  localVue
})

describe('IconMore.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('g').attributes('fill')).toBe('#fff')
    expect(wrapper.find('circle').attributes('stroke')).toBe('none')
  })
})
