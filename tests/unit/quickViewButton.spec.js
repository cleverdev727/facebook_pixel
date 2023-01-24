import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import QuickViewButton from '@/components/lola/QuickViewButton'
import products from '@/tests/mocks/products'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()

const mockProductMixin = {
  methods: {
    setProduct(product) {},
    updateSelectedVariantId() {}
  }
}

const actions = {
  productReorder: jest.fn()
}

const store = new Vuex.Store({
  modules: {
    events: {
      actions,
      namespaced: true
    },
    'quick-view': {
      state: {
        quickViewVisible: false
      },
      mutations: {
        toggleQuickView: jest.fn()
      },
      namespaced: true
    }
  }
})

const wrapperDefault = shallowMount(QuickViewButton, {
  localVue,
  router,
  store,
  mixins: [mockProductMixin],
  propsData: {
    quickAddProduct: products[0]
  }
})

const wrapperBuyAgain = shallowMount(QuickViewButton, {
  localVue,
  router,
  store,
  mixins: [mockProductMixin],
  propsData: {
    quickAddProduct: products[0],
    ctaText: 'Buy again'
  }
})

const wrapperOutOfStock = shallowMount(QuickViewButton, {
  localVue,
  router,
  store,
  mixins: [mockProductMixin],
  propsData: {
    quickAddProduct: products[0]
  },
  computed: {
    isOutOfStock() {
      return true
    }
  }
})

describe('QuickViewButton.vue', () => {
  describe('has correct button text', () => {
    it.each([
      ['Quick View', wrapperDefault],
      ['Buy again', wrapperBuyAgain],
      ['Out of stock', wrapperOutOfStock]
    ])('should have the text - %s', (label, wrapper) => {
      expect(wrapper.find('button').text()).toEqual(label)
    })
  })

  describe('google analytics event', () => {
    it.each([
      ['skip', 'Out Of Stock Button', wrapperOutOfStock, 0],
      ['skip', 'Default Button', wrapperDefault, 0],
      ['not skip', 'Buy-again Button', wrapperBuyAgain, 1]
    ])(
      'should %s google analytics event for %s',
      (action, description, wrapper, callCount) => {
        const button = wrapper.find('button')
        button.trigger('click')
        expect(actions.productReorder).toHaveBeenCalledTimes(callCount)
      }
    )
  })
})
