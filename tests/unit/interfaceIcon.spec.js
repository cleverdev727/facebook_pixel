import { shallowMount } from '@vue/test-utils'
import InterfaceIcon from '@/components/nacelle/InterfaceIcon'

describe('InterfaceIcon.vue', () => {
  it('renders an svg', () => {
    const wrapper = shallowMount(InterfaceIcon, {
      propsData: { iconName: 'cart', iconAction: 'cart/showCart' },
      stubs: ['nuxt-img']
    })
    expect(wrapper.html()).toEqual(
      `<div class="interface-icon nacelle" iconaction="cart/showCart">
  <nuxt-img-stub src="https://nacelle-assets.s3-us-west-2.amazonaws.com/default-cart-icon.svg" class="icon"></nuxt-img-stub>
</div>`
    )
  })
})
