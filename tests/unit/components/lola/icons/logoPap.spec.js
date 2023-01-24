import { createLocalVue, shallowMount } from '@vue/test-utils'

import LogoPap from '@/components/lola/icons/LogoPap.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(LogoPap, {
  localVue
})

describe('LogoPap.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('title').text()).toEqual('PAP 21')
  })
})
