import Vue from 'vue'
import Vuex from 'vuex'
import { mount } from '@vue/test-utils'
import CartFlyoutHeader from '@/components/nacelle/CartFlyoutHeader'
import MessagingFreeShippingCounter from '@/components/nacelle/MessagingFreeShippingCounter'
import storeConfig from '@/tests/storeConfig'

Vue.use(Vuex)

describe('CartFlyoutHeader.vue', () => {
  it('displays the correct shipping counter when cart is empty', async () => {
    const store = new Vuex.Store(storeConfig())
    const wrapper = mount(CartFlyoutHeader, {
      store,
      propsData: { title: 'Your Cart' }
    })

    const shippingCounter = wrapper.findComponent(MessagingFreeShippingCounter)
    store.commit('cart/setFreeShippingThreshold', 25)
    await wrapper.vm.$nextTick()
    expect(shippingCounter.exists()).toBe(true)
    expect(wrapper.find('.threshold').text()).toBe('$25')
  })

  it('displays amount left for free shipping counter', async () => {
    const store = new Vuex.Store(storeConfig())
    const wrapper = mount(CartFlyoutHeader, {
      store,
      propsData: { title: 'Your Cart' }
    })

    store.commit('cart/setFreeShippingThreshold', 25)
    store.dispatch('cart/addLineItem', {
      image: {
        source: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
      },
      title: 'Gray T-Shirt',
      productId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4NjE3Mzc=',
      handle: 'gray-t-shirt',
      quantity: 1,
      variant: {
        id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yODU2ODgyMDAyMzQwMQ==',
        price: '15.99'
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.threshold').text()).toBe('$9.01')
  })
})
