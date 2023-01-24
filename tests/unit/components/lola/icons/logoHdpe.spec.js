import { createLocalVue, shallowMount } from '@vue/test-utils'

import LogoHdpe from '@/components/lola/icons/LogoHdpe.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(LogoHdpe, {
  localVue
})

describe('LogoHdpe.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('title').text()).toEqual('HDPE 2')
  })
})
