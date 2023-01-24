import { createLocalVue, shallowMount } from '@vue/test-utils'

import LogoAluminum from '@/components/lola/icons/LogoAluminum.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(LogoAluminum, {
  localVue
})

describe('LogoAluminum.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('title').text()).toEqual(
      'Made from recyclable aluminium'
    )
  })
})
