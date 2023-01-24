import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { VTooltip } from 'v-tooltip'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import storeConfig from '@/tests/storeConfig'
import skipToDonate from '@/components/account/SkipToDonate'
import subscriptions from '@/tests/mocks/subscriptions'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.directive('tooltip', VTooltip)

const router = new VueRouter()
const store = new Vuex.Store(storeConfig)
const wrapper = shallowMount(skipToDonate, {
  mocks: {
    $config: { donationVariantId: 1221 }
  },
  localVue,
  router,
  store,
  propsData: {
    isBulk: false,
    id: 2,
    subscriptions
  },
  stubs: ['client-only', 'popup', 'nuxt-img']
})

describe('SkipToDonate.vue', () => {
  it('renders correctly', () => {
    expect(wrapper.vm.$data.donationProduct.sku).toEqual('SKIPTODONATE')
    expect(wrapper.find('button').text()).toEqual('Skip to donate')
  })

  it('show/hide skip to donate popup', () => {
    expect(wrapper.vm.$data.showSkipPopup).toEqual(false)
    const donateCta = wrapper.find('button')
    donateCta.trigger('click')
    expect(wrapper.vm.$data.showSkipPopup).toEqual(true)
  })

  it('show/hide thank you popup', () => {
    expect(wrapper.vm.$data.showThankYouPopup).toEqual(false)
    const donateCta = wrapper.findAll('button').at(1)
    expect(donateCta.text()).toEqual('Proceed to donate')
    // TODO: mock window._iaq
    // donateCta.trigger('click')
    // expect(wrapper.vm.$data.showThankYouPopup).toEqual(true)
  })
})
