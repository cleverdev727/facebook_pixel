import { createLocalVue, shallowMount } from '@vue/test-utils'

import IconChevronDown from '@/components/lola/icons/IconChevronDown.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(IconChevronDown, {
  localVue,
  propsData: {
    classz: 'icon-chevron'
  }
})

const wrapper2 = shallowMount(IconChevronDown, {
  localVue
})

describe('IconChevronDown.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('.icon-chevron').exists()).toBeTruthy()
    expect(wrapper2.find('.icon-chevron').exists()).toBeFalsy()
  })
})
