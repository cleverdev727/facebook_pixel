import { createLocalVue, shallowMount } from '@vue/test-utils'

import ArrowCircleRight from '@/components/lola/icons/ArrowCircleRight.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(ArrowCircleRight, {
  localVue
})

describe('ArrowCircleRight.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('circle')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
  })
})
