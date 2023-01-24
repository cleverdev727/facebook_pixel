import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { createLocalVue, shallowMount, RouterLinkStub } from '@vue/test-utils'
import storeConfig from '@/tests/storeConfig'
import Orders from '@/components/account/Orders'
import orders from '@/tests/mocks/orders'
import products from '@/tests/mocks/products'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const localStoreConfig = storeConfig
const store = new Vuex.Store(localStoreConfig)
const buyAgain = orders.slice(4)
const quickAddSpy = jest.spyOn(Orders.methods, 'showQuickAdd')
const getHandleSpy = jest.spyOn(Orders.methods, 'getHandle')
// TODO: find a way of handling getProduct function
// called inside getHandle instead of mock returning
// a nuxt-link's :to value
getHandleSpy.mockReturnValue('/products/pads')

const wrapper = shallowMount(Orders, {
  localVue,
  router,
  store,
  propsData: {
    orders,
    products,
    buyAgain
  },
  stubs: ['nuxt-link', 'nuxt-img', 'client-only', 'quick-view']
})

const wrapper2 = shallowMount(Orders, {
  localVue,
  router,
  store,
  stubs: ['nuxt-link', 'nuxt-img', 'client-only', 'quick-view']
})

const wrapper3 = shallowMount(Orders, {
  localVue,
  store,
  propsData: {
    orders,
    products,
    buyAgain
  },
  stubs: {
    NuxtLink: RouterLinkStub
  }
})

describe('AccountOrders.vue', () => {
  it('renders both orders and buy again headers', () => {
    expect(wrapper.find('h2').text()).toEqual('Buy it again')
    expect(wrapper.findAll('h2').at(1).text()).toEqual('Order history')
    expect(wrapper.find('p').text()).toContain(
      `Loved your one time purchase? Easily reorder your faves using ‘Buy
        Again’!`
    )
    expect(wrapper.findAll('.order-history_desc').at(1).text())
      .toEqual(`You can find information on all your previous one time and
        subscription purchases below.`)
  })

  it('launches quickAdd on img click', () => {
    const quickAddCta = wrapper.find('.buy-again_img')
    quickAddCta.trigger('click')
    expect(quickAddSpy).toBeCalled()
  })

  it('launches quickadd on buy again cta click', () => {
    const buyAgainCta = wrapper.find('.button')
    buyAgainCta.trigger('click')
    expect(quickAddSpy).toBeCalled()
  })

  it('Navigates to PDP on write review cta click', () => {
    const reviewCta = wrapper3.findComponent(RouterLinkStub)
    expect(reviewCta.text()).toEqual('Write review')
    expect(reviewCta.props().to).toEqual('/products/pads#reviews')
    expect(getHandleSpy).toHaveBeenNthCalledWith(1, buyAgain[0])
  })

  it('shows more orders if any', () => {
    if (wrapper.vm.moreOrders) {
      expect(wrapper.vm.$data.shownOrders.length).toBe(5)
      const moreCta = wrapper
        .findAll('.order-history_pagination')
        .at(1)
        .find('span')
      moreCta.trigger('click')
      expect(wrapper.vm.$data.shownOrders.length).toBe(8)
    }
  })

  it('updates shown buy agains count on clicking `see more`/ `see less`', () => {
    if (wrapper.vm.moreBuyAgain) {
      expect(wrapper.vm.shownBuyAgain.length).toEqual(3)
      const moreLessCta = wrapper.find('.order-history_pagination').find('span')
      expect(moreLessCta.text()).toEqual('see more')
      moreLessCta.trigger('click')
      expect(wrapper.vm.shownBuyAgain.length).toEqual(4)
      expect(wrapper.vm.seeMoreText).toEqual('see less')
      moreLessCta.trigger('click')
      expect(wrapper.vm.shownBuyAgain.length).toEqual(3)
    }
  })

  it('renders correctly if no orders', () => {
    expect(wrapper2.vm.shownBuyAgain.length).toEqual(0)
    expect(wrapper2.findAll('.order-history_none').at(1).text()).toEqual(
      'There is no order history. Start shopping'
    )
    expect(wrapper2.find('.order-history_none').text()).toContain(
      'You haven’t placed a one time order...yet.'
    )
  })
})
