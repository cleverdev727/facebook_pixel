import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import storeConfig from '@/tests/storeConfig'
import PageHandle from '@/pages/account/search/_pageHandle.vue'
import products from '@/tests/mocks/products'

const localVue = createLocalVue()
localVue.use(Vuex)
const store = new Vuex.Store(storeConfig())
const $route = {
  params: {
    pageHandle: 1
  },
  query: {
    address: 2
  },
  path: '/account/search/1?address=2'
}
const wrapper = shallowMount(PageHandle, {
  localVue,
  store,
  stubs: ['account-header', 'search-icon', 'account-products', 'pagination'],
  mocks: { $route },
  computed: {
    rechargeProducts() {
      return products
    }
  }
})
const productsCount = wrapper.vm.rechargeProducts.length

describe('Account search products', () => {
  it('renders correctly', () => {
    expect(wrapper.find('h2').text()).toEqual('Shop all products')
    expect(wrapper.find('p').text()).toContain(
      'Add new products to your subscription'
    )
    expect(wrapper.vm.selectedAddress).toEqual(2)
  })

  it('show correct info if no search term', () => {
    expect(wrapper.vm.pages).toEqual(1)
    expect(wrapper.vm.searchResults).toHaveLength(0)
    expect(wrapper.vm.currentProducts).toHaveLength(productsCount)
    expect(wrapper.vm.noResults).toBeFalsy()
  })

  it('returns search results ', async () => {
    const compactApplicators = products.find(
      (product) => product.handle === 'applicator-tampons'
    )
    await wrapper.setData({ searchTerm: 'C' })
    expect(wrapper.vm.searchResults).toHaveLength(4)
    expect(wrapper.vm.searchResults).toContain(compactApplicators)
    await wrapper.setData({ searchTerm: 'Compactttx' })
    expect(wrapper.vm.searchResults).toHaveLength(1)
    await wrapper.setData({ searchTerm: 'Compact' })
    expect(wrapper.vm.searchResults).toHaveLength(1)
    expect(wrapper.vm.currentProducts).toHaveLength(productsCount)
  })

  it('show error message if no search results', async () => {
    await wrapper.setData({ searchTerm: 'not there' })
    expect(wrapper.vm.noResults).toBeTruthy()
    expect(wrapper.find('.no-results').text()).toContain(
      'Oops... there are no search results'
    )
  })
})
