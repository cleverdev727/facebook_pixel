import { createLocalVue, shallowMount } from '@vue/test-utils'

import AccountIcon from '@/components/lola/icons/AccountIcon.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(AccountIcon, {
  localVue
})

describe('AccountIcon.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('svg')).toBeTruthy()
    expect(wrapper.find('path')).toBeTruthy()
    expect(wrapper.find('path').attributes('fill')).toBe('#514945')
  })
})
