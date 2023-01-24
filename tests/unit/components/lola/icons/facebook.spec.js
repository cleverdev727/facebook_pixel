import { createLocalVue, shallowMount } from '@vue/test-utils'

import Facebook from '@/components/lola/icons/Facebook.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(Facebook, {
  localVue
})

describe('Facebook.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('path').attributes('fill')).toBe('#514945')
  })
})
