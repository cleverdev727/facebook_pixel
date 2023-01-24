import { createLocalVue, shallowMount } from '@vue/test-utils'

import IconHeart from '@/components/lola/icons/IconHeart.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(IconHeart, {
  localVue
})

describe('IconHeart.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('image')).toBeTruthy()
  })
})
