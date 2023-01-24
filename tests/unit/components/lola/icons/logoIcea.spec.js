import { createLocalVue, shallowMount } from '@vue/test-utils'

import LogoIcea from '@/components/lola/icons/LogoIcea.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(LogoIcea, {
  localVue
})

describe('LogoIcea.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('title').text()).toEqual('ICEA Certified')
  })
})
