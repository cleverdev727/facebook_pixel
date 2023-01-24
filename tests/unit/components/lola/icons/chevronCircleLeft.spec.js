import { createLocalVue, shallowMount } from '@vue/test-utils'

import ChevronCircleLeft from '@/components/lola/icons/ChevronCircleLeft.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(ChevronCircleLeft, {
  localVue
})

describe('ChevronCircleLeft.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
  })
})
