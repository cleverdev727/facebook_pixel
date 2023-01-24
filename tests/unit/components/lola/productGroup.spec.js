import ProductGroup from '@/components/lola/ProductGroup.vue'
import ProductRecommendations from '@/components/lola/ProductRecommendations.vue'
import { TestWrapperBuilder } from '../../../../utils/tests.util'
import allProducts from './../../../mocks/products'
import { addObjectFieldsToParent } from '~/helpers/general'

jest.mock('~/helpers/general', () => {
  return {
    _esModule: true,
    ...jest.requireActual('~/helpers/general'),
    addObjectFieldsToParent: jest
      .fn()
      .mockReturnValue({ handle: 'some-handle::en-US' })
  }
})

const products = allProducts.slice(0, 3)
const getProductsByHandlesSpy = jest.fn().mockResolvedValue(products)
const mixin = {
  methods: {
    getProductsByHandles: getProductsByHandlesSpy
  }
}
const $fetchState = { pending: false }
const wrapperBuilder = TestWrapperBuilder(ProductGroup, {
  propsData: {
    products: ['handle-1', 'handle-2']
  },
  stubs: ['product-recommendations'],
  mocks: { $fetchState },
  mixins: [mixin]
})

describe('ProductGroup.vue', () => {
  const wrapper = wrapperBuilder.build()

  it('renders product group', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.product-group').exists()).toBe(true)
  })

  it('renders product recommendations', () => {
    const list = wrapper.findComponent(ProductRecommendations)
    expect(list.exists()).toBe(true)
  })

  it('sets productList after fetching from server', async () => {
    await ProductGroup.fetch.call(wrapper.vm)
    expect(addObjectFieldsToParent).toHaveBeenCalled()
    expect(getProductsByHandlesSpy).toHaveBeenCalled()
    expect(wrapper.vm.productsList).toStrictEqual(products)
  })

  it('does not render products when products prop is missing', async () => {
    await wrapper.setProps({ products: undefined })
    const list = wrapper.findComponent(ProductRecommendations)
    expect(list.exists()).toBe(false)
  })

  it('does not render products when products prop is empty', async () => {
    await wrapper.setProps({ products: [] })
    const list = wrapper.findComponent(ProductRecommendations)
    expect(list.exists()).toBe(false)
  })
})
