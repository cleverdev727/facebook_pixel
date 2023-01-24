import { createLocalVue, shallowMount } from '@vue/test-utils'

import LogoGots from '@/components/lola/icons/LogoGots.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(LogoGots, {
  localVue
})

describe('LogoGots.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('title').text()).toEqual('GOTS Certified')
  })
})
