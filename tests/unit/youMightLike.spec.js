import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import ProductRecommendations from '@/components/lola/ProductRecommendations'
import YouMightLike from '@/components/lola/YouMightLike.vue'
import createStoreConfig from '@/tests/storeConfig'
import allProducts from './../mocks/products'

Vue.use(Vuex)

const getProductsByHandlesSpy = jest
  .fn()
  .mockResolvedValue(allProducts.slice(0, 3))

const store = new Vuex.Store(createStoreConfig())
const wrapper = mount(YouMightLike, {
  data() {
    return {
      loading: false,
      products: [],
      // Couldn't find a better way to stub the "getProductsByHandles"
      // method. setMethods() is deprecated and the component itself
      // has no internal "methods" property since it uses a mixin.
      // This means doing something like jest.spyOn(YouMightLike.methods)
      // throws an error about the spied method being undefined.
      getProductsByHandles: getProductsByHandlesSpy
    }
  },
  store,
  stubs: ['product-recommendations']
})

describe('YouMightLike.vue', () => {
  it('renders a parent container that displays product recommendations', () => {
    expect(getProductsByHandlesSpy).toHaveBeenCalled()
    const container = wrapper.find('.you-might-like')
    expect(container.exists()).toBe(true)
    expect(container.find('p.header').text()).toBe('You might like')
    expect(wrapper.vm.loading).toBe(false)
  })

  it('mounts a product recommendation component', () => {
    const recommendation = wrapper.findComponent(ProductRecommendations)
    expect(recommendation.exists()).toBe(true)
  })

  it('emits a loaded event when the length of the products changes', async () => {
    wrapper.vm.products = [allProducts[0]]
    await wrapper.vm.$nextTick()
    // Assert that products is updated fr the second time.
    // The first tme is on mount()
    expect(wrapper.emitted('loaded').length).toBe(2)
  })

  it("doesn't emit a loaded event when the length of the products is zero", async () => {
    wrapper.vm.products = []
    await wrapper.vm.$nextTick()
    // Assert that this event hasn't been emmited since the last time.
    expect(wrapper.emitted('loaded').length).toBe(2)
  })
})
