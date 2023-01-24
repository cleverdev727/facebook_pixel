import { createLocalVue, shallowMount } from '@vue/test-utils'

import ChevronRight from '@/components/lola/icons/ChevronRight.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(ChevronRight, {
  localVue
})

describe('ChevronRight.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
  })
})
