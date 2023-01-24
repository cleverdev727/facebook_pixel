import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import storeConfig from '@/tests/storeConfig'
import Subscriptions from '@/components/account/Subscriptions'
import subscriptions from '@/tests/mocks/subscriptions'
import products from '@/tests/mocks/products'
import addresses from '@/tests/mocks/addresses'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const store = new Vuex.Store(storeConfig)
const getAddressSubsSpy = jest.spyOn(Subscriptions.methods, 'addressSubs')
const wrapper = shallowMount(Subscriptions, {
  localVue,
  router,
  store,
  propsData: {
    subscriptions,
    products,
    activeAddresses: addresses
  },
  stubs: ['client-only', 'address-item']
})
const emptyWrapper = shallowMount(Subscriptions, {
  localVue,
  router,
  store,
  stubs: ['client-only']
})

describe('AccountSubscriptions.vue', () => {
  it('renders correctly', () => {
    expect(wrapper.find('.subscriptions_title').text()).toEqual(
      'My subscriptions'
    )
    expect(wrapper.findAll('.subscription-card')).toHaveLength(5)
  })

  it('finds subscriptions for each address', () => {
    expect(getAddressSubsSpy).toHaveBeenCalled()
  })

  it('shows correct message if no subscriptions', () => {
    expect(emptyWrapper.find('.subscription-none').text()).toEqual(
      'You have no active subscriptions'
    )
  })
})
