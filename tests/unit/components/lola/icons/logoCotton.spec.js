import { createLocalVue, shallowMount } from '@vue/test-utils'

import LogoCotton from '@/components/lola/icons/LogoCotton.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(LogoCotton, {
  localVue
})

describe('LogoCotton.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('title').text()).toEqual('Cotton')
  })
})
