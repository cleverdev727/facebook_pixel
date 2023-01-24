import { createLocalVue, shallowMount } from '@vue/test-utils'
import AccountProducts from '@/components/account/AccountProducts'
import products from '@/tests/mocks/products'

const localVue = createLocalVue()
const rechargeProducts = products.filter(
  (product) => product.media !== undefined && product.metadata !== undefined
)
const wrapper = shallowMount(AccountProducts, {
  localVue,
  propsData: {
    products: rechargeProducts,
    selectedAddress: '2'
  },
  stubs: ['nuxt-img', 'client-only', 'nuxt-link']
})

describe('AccountProducts.vue', () => {
  it('renders correctly', () => {
    expect(wrapper.find('h3').text()).toEqual(
      'Compact plastic applicator tampons'
    )
    expect(wrapper.find('p').text()).toEqual('Our #1 bestseller for a reason')
    expect(wrapper.findAll('li')).toHaveLength(rechargeProducts.length)
  })
})
