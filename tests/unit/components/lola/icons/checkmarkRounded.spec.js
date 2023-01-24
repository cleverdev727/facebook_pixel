import { createLocalVue, shallowMount } from '@vue/test-utils'

import CheckmarkRounded from '@/components/lola/icons/CheckmarkRounded.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(CheckmarkRounded, {
  localVue
})

describe('CheckmarkRounded.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('rect').attributes('fill')).toBe('#4e6282')
    expect(wrapper.find('path').attributes('fill')).toBe('#fff')
  })
})
