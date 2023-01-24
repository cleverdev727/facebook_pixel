import { createLocalVue, shallowMount } from '@vue/test-utils'

import LogoLdpe from '@/components/lola/icons/LogoLdpe.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(LogoLdpe, {
  localVue
})

describe('LogoLdpe.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('title').text()).toEqual('LDPE 4')
  })
})
