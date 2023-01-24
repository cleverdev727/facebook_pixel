import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import storeConfig from '@/tests/storeConfig'
import Upsells from '@/components/account/AccountUpsells'
import addresses from '@/tests/mocks/addresses'
import products from '@/tests/mocks/products'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const store = new Vuex.Store(storeConfig)
const setActiveDotSpy = jest.spyOn(Upsells.methods, 'setActiveDot')
const handleScrollLeftSpy = jest.spyOn(Upsells.methods, 'handleScrollLeft')
const handleScrollRightSpy = jest.spyOn(Upsells.methods, 'handleScrollRight')
const showQuickAddSpy = jest.spyOn(Upsells.methods, 'showQuickAdd')
const wrapper = shallowMount(Upsells, {
  localVue,
  router,
  store,
  propsData: {
    addresses,
    products
  },
  data() {
    return {
      dotsCount: 2,
      activeDot: 1
    }
  },
  stubs: ['nuxt-img', 'quick-view', 'client-only']
})

describe('AccountUpsells.vue', () => {
  it('renders correctly', () => {
    expect(wrapper.find('.account_upsell_header').text()).toEqual(
      'Products you may like'
    )
    expect(wrapper.findAll('.account_upsell_product')).toHaveLength(6)
  })

  it('sets active dot', async () => {
    await localVue.nextTick()
    const dot = wrapper.find('.account_upsell_dot')
    dot.trigger('click')
    expect(setActiveDotSpy).toHaveBeenCalled()
  })

  it('scroll right', () => {
    const rightCta = wrapper
      .find('.account_upsell_arrows')
      .findAll('span')
      .at(1)
    rightCta.trigger('click')
    expect(handleScrollRightSpy).toHaveBeenCalled()
  })

  it('scroll left', () => {
    const leftCta = wrapper.find('.account_upsell_arrows').find('span')
    leftCta.trigger('click')
    expect(handleScrollLeftSpy).toHaveBeenCalled()
  })

  it('shows upsell modal', () => {
    const quickAddCta = wrapper.find('.account_upsell_product-title')
    expect(quickAddCta.text()).toEqual('Compact plastic applicator tampons')
    quickAddCta.trigger('click')
    expect(showQuickAddSpy).toHaveBeenCalled()
  })
})
