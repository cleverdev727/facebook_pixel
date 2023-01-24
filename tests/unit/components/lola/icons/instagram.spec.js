import { createLocalVue, shallowMount } from '@vue/test-utils'

import Instagram from '@/components/lola/icons/Instagram.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(Instagram, {
  localVue
})

describe('Instagram.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('circle')).toBeTruthy()
  })
})
