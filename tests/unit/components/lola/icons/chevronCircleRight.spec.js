import { createLocalVue, shallowMount } from '@vue/test-utils'

import ChevronCircleRight from '@/components/lola/icons/ChevronCircleRight.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(ChevronCircleRight, {
  localVue
})

describe('ChevronCircleRight.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
  })
})
