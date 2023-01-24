import { createLocalVue, shallowMount } from '@vue/test-utils'

import PlayButton from '@/components/lola/icons/PlayButton.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(PlayButton, {
  localVue
})

describe('PlayButton.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('g')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('circle').attributes('fill')).toBe('#fff')
  })
})
