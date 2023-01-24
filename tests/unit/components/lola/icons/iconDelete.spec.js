import { createLocalVue, shallowMount } from '@vue/test-utils'

import IconDelete from '@/components/lola/icons/IconDelete.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(IconDelete, {
  localVue
})

describe('IconDelete.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
  })
})
