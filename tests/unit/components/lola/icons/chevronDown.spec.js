import { createLocalVue, shallowMount } from '@vue/test-utils'

import ChevronDown from '@/components/lola/icons/ChevronDown.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(ChevronDown, {
  localVue
})

describe('ChevronDown.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
  })
})
