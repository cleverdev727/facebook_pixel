import { createLocalVue, shallowMount } from '@vue/test-utils'

import LogoPp from '@/components/lola/icons/LogoPp.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(LogoPp, {
  localVue
})

describe('LogoPp.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('title').text()).toEqual('Cotton')
  })
})
