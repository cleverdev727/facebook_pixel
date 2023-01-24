import { createLocalVue, shallowMount } from '@vue/test-utils'

import LogoGl from '@/components/lola/icons/LogoGl.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(LogoGl, {
  localVue
})

describe('LogoGl.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('title').text()).toEqual('GL 71')
  })
})
