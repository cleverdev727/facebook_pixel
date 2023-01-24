import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import storeConfig from '@/tests/storeConfig'
import quickView from '@/components/lola/QuickView'
import quickViewButton from '@/components/lola/QuickViewButton'
import products from '@/tests/mocks/products'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const localStoreConfig = storeConfig
const store = new Vuex.Store(localStoreConfig)
const product = products[0]
const showQuickViewSpy = jest.spyOn(quickViewButton.methods, 'handleClick')

const wrapper = shallowMount(quickView, {
  localVue,
  router,
  store,
  stubs: ['nuxt-img', 'nuxt-link', 'client-only', 'product-add-to-cart-button'],
  computed: {
    product() {
      return product
    },
    assortmentMobileInfo() {
      return '$11 / 18 count / Buy one time'
    },
    hasAssortments() {
      return true
    },
    selectedVariantId() {
      return 32106320265274
    },
    selectedQuantity() {
      return 1
    }
  }
})

const wrapperButton = shallowMount(quickViewButton, {
  localVue,
  router,
  store,
  stubs: ['quick-view'],
  propsData: {
    quickAddProduct: product
  }
})

describe('QuickView.vue', () => {
  it('renders correctly with no errors', () => {
    expect(wrapper.vm.$data.reveal).toEqual(false)
    expect(wrapper.find('h3').text()).toEqual(
      'Compact plastic applicator tampons'
    )
  })

  it('processes product info', () => {
    expect(wrapper.vm.$data.product__.handle).toEqual('applicator-tampons')
    expect(wrapper.vm.$data.product__.availableForSale).toBe(true)
    expect(wrapper.vm.$data.product__.tags).toContain('recharge-product')
    expect(wrapper.vm.$data.product__.metadata.isValuePack).toBe(false)
  })

  it('quick view cta', () => {
    const quickViewCta = wrapperButton.find('button')
    expect(quickViewCta.text()).toEqual('Quick View')
    quickViewCta.trigger('click')
    expect(showQuickViewSpy).toHaveBeenCalledTimes(1)
  })
})
