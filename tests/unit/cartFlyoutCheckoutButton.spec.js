import Vuex from 'vuex'

import CartFlyoutCheckoutButton from '@/components/nacelle/CartFlyoutCheckoutButton'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import createStoreConfig from '@/tests/storeConfig'

const storeConfig = createStoreConfig()

const localVue = createLocalVue()
localVue.use(Vuex)

const localStoreConfig = storeConfig
const store = new Vuex.Store(localStoreConfig)
const wrapperDefault = shallowMount(CartFlyoutCheckoutButton, {
  store
})

describe('CartFlyoutCheckoutButton', () => {
  it('displays checkout button with default checkoutText', () => {
    expect(wrapperDefault.find('.checkout-button').text()).toEqual('Checkout')
  })

  it('displays checkout button with custom checkoutText', () => {
    const wrapperCheckout = shallowMount(CartFlyoutCheckoutButton, {
      store,
      propsData: {
        checkoutText: 'Check me out!'
      }
    })
    expect(wrapperCheckout.find('.checkout-button').text()).toEqual(
      'Check me out!'
    )
  })
})
