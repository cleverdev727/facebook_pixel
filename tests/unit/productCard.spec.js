import Vuex from 'vuex'
import { createLocalVue, mount } from '@vue/test-utils'
import ProductCard from '@/components/lola/ProductCard'
import createStoreConfig from '@/tests/storeConfig'
import products from '@/tests/mocks/products'
import { imagePlaceholder } from '../../helpers/general'

const storeConfig = createStoreConfig()
const localVue = createLocalVue()

localVue.use(Vuex)

const localStoreConfig = storeConfig
const defaultProduct = products[0]
const { assortmentSkus, ...rest } = defaultProduct.metadata
const noQuickViewProduct = {
  ...defaultProduct,
  metadata: { ...rest, isValuePack: true }
}
const outOfStockProduct = {
  ...defaultProduct,
  tags: ['oos', ...defaultProduct.tags],
  metadata: { ...rest }
}
const store = new Vuex.Store(localStoreConfig)
const wrapper = mount(ProductCard, {
  localVue,
  store,
  propsData: {
    product: defaultProduct
  },
  stubs: ['nuxt-link', 'nuxt-img']
})

const wrapper2 = mount(ProductCard, {
  localVue,
  store,
  propsData: {
    product: noQuickViewProduct
  },
  stubs: ['nuxt-link', 'nuxt-img']
})

const wrapper3 = mount(ProductCard, {
  localVue,
  store,
  propsData: {
    product: outOfStockProduct
  },
  stubs: ['nuxt-link', 'nuxt-img']
})
const addToCartSpy = jest.spyOn(wrapper3.vm, 'addToCart')
const spyAddLineItem = jest.spyOn(wrapper2.vm, 'addLineItem')

describe('ProductCard.vue', () => {
  it('renders product card', () => {
    expect(wrapper.find('.product').exists()).toBe(true)
    expect(wrapper.find('.title').text()).toEqual(
      'Compact plastic applicator tampons'
    )
    expect(wrapper.find('.product--saving-badge').text()).toEqual('Save $9')
  })

  it('renders quickview cta', () => {
    const addCta = wrapper.findAll('.add-btn')
    expect(wrapper.vm.usesQuickView).toBe(true)
    expect(addCta.at(1).text()).toEqual('Quick View')
  })

  it('displays first product image when available', () => {
    const src = wrapper.vm.getProductSrc(defaultProduct)
    expect(src).toBe(defaultProduct.media[0].src)
  })

  it('displays placeholder when product image is not available', () => {
    const { media, ...newProduct } = defaultProduct
    const src = wrapper.vm.getProductSrc(newProduct)
    expect(src).toBe(imagePlaceholder)
  })

  it('Test adding of line item', async () => {
    jest.useFakeTimers()
    const addCta = wrapper2.findAll('.add-btn').at(0)
    await addCta.trigger('click')
    expect(addCta.text().toLowerCase()).toBe('added!')
    expect(spyAddLineItem).toHaveBeenCalled()
    expect(store.state.cart.lineItems.length).toBeGreaterThan(0)
    jest.runAllTimers()
    await wrapper2.vm.$nextTick()
    expect(addCta.text().toLowerCase()).toBe('add to cart')
    expect(
      store.state.cart.lineItems[0].metafields.some(
        (x) => x.key === 'fulfillable_quantity' && x.value === '8'
      )
    ).toBe(true)
  })

  describe('Out of stock product', () => {
    it('shows out of stock button text', () => {
      const addCta = wrapper3.findAll('.add-btn').at(0)
      expect(addCta.text().toLowerCase()).toEqual('out of stock')
      expect(addCta.element).toHaveAttribute('disabled')
    })

    it('Do nothing when cart button is clicked', async () => {
      const addCta = wrapper3.findAll('.add-btn').at(0)
      // Remove disabled attribute so that this can be tested
      addCta.element.removeAttribute('disabled')
      await wrapper3.vm.$nextTick()
      expect(addCta.element).not.toBeDisabled()
      await addCta.trigger('click')
      expect(addToCartSpy).toBeCalled()
      expect(addToCartSpy).toHaveReturnedWith(false)
    })
  })
})
