import { createLocalVue, shallowMount } from '@vue/test-utils'

import ReloadIcon from '@/components/lola/icons/ReloadIcon.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(ReloadIcon, {
  localVue
})

describe('ReloadIcon.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('image')).toBeTruthy()
  })
})
