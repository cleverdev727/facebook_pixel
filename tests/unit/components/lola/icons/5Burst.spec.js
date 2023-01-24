import { createLocalVue, shallowMount } from '@vue/test-utils'

import Burst from '@/components/lola/icons/5Burst.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(Burst, {
  localVue
})

describe('5Burst.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('tspan')).toBeTruthy()
    expect(wrapper.find('path').attributes('fill')).toBe('#c88d75')
  })
})
