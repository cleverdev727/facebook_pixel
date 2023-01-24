import { createLocalVue, shallowMount } from '@vue/test-utils'

import CartIcon from '@/components/lola/icons/CartIcon.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(CartIcon, {
  localVue
})

describe('CartIcon.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('path').attributes('fill')).toBe('#514945')
    expect(wrapper.find('circle').attributes('fill')).toBe('#514945')
  })
})
