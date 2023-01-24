import { createLocalVue, shallowMount } from '@vue/test-utils'

import IconFreeShipping from '@/components/lola/icons/IconFreeShipping.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(IconFreeShipping, {
  localVue
})

describe('IconFreeShipping.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('circle').attributes('stroke')).toBe('none')
  })
})
