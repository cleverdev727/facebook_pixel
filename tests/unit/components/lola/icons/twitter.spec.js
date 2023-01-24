import { createLocalVue, shallowMount } from '@vue/test-utils'

import Twitter from '@/components/lola/icons/Twitter.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(Twitter, {
  localVue
})

describe('Twitter.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
  })
})
