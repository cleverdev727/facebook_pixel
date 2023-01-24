import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import createStoreConfig from '@/tests/storeConfig'
import Orders from '@/pages/account/orders.vue'

const storeConfig = createStoreConfig()

const localVue = createLocalVue()
localVue.use(Vuex)

const localStoreConfig = storeConfig
const store = new Vuex.Store(localStoreConfig)
const wrapper = shallowMount(Orders, {
  localVue,
  store,
  stubs: ['account-header', 'customer-card', 'help', 'orders']
})

const orders = [
  {
    line_items: [
      {
        price: '10.00',
        product_title: 'Ultra thin lubricated condoms',
        properties: [
          {
            name: 'shipping_interval_frequency',
            value: 4
          },
          {
            name: 'shipping_interval_unit_type',
            value: 'weeks'
          }
        ],
        sku: 'UTC',
        shipped_date: '2022-01-07T00: 20: 06'
      },
      {
        price: '13.00',
        product_title: 'Personal lubricant',
        properties: [],
        sku: 'CCLUB',
        shipped_date: '2022-01-07T00: 20: 06'
      },
      {
        price: '8.00',
        product_title: 'Cardboard applicator tampons',
        properties: [],
        sku: 'CB1800',
        shipped_date: '2022-01-07T00: 20: 06'
      },
      {
        price: '0.00',
        product_title: 'Daily multivitamin',
        properties: [
          {
            name: 'referenced_product_handle',
            value: 'daily-supplement'
          }
        ],
        sku: 'CCSUP',
        shipped_date: '2022-01-07T00: 20: 06'
      }
    ]
  }
]

it('removes daily multivitamin from buy again history', async () => {
  await store.commit('account/setOrders', orders)
  const products = wrapper.vm.recentSixOneTimeProducts
  const skus = products.map((product) => product.sku)
  expect(skus.includes('CCSUP')).toBeFalsy()
})
