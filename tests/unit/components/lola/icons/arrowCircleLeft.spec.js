import { createLocalVue, shallowMount } from '@vue/test-utils'

import ArrowCircleLeft from '@/components/lola/icons/ArrowCircleLeft.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(ArrowCircleLeft, {
  localVue
})

describe('ArrowCircleLeft.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('circle')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
  })
})
