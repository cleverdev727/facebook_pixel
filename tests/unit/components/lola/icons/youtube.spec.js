import { createLocalVue, shallowMount } from '@vue/test-utils'

import Youtube from '@/components/lola/icons/Youtube.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(Youtube, {
  localVue
})

describe('Youtube.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('path').attributes('fill')).toBe('#514945')
  })
})
