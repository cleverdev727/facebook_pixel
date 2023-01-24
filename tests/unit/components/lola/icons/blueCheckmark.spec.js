import { createLocalVue, shallowMount } from '@vue/test-utils'

import BlueCheckmark from '@/components/lola/icons/BlueCheckmark.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(BlueCheckmark, {
  localVue
})

describe('BlueCheckmark.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path').attributes('stroke')).toBe('white')
  })
})
