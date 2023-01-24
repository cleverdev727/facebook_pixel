import { createLocalVue, shallowMount } from '@vue/test-utils'

import ArrowToggle from '@/components/lola/icons/ArrowToggle.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(ArrowToggle, {
  localVue
})

describe('ArrowToggle.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.findAll('path').at(1).attributes('fill')).toBe('#999391')
  })
})
