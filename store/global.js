// TODO: Fetch from contentful
const globalPrepayData = {
  prepayTags: {
    popular: '<p><span class="prepay-product-tag">Popular</span></p>',
    value: '<p><span class="prepay-product-tag">Best value</span></p>'
  }
}

const product = null
// This is hardcoded pending the
// implementation of editing cart
const defaultPurchaseType = ''

const addDefaultProperties = (product) => {
  return {
    product,
    purchaseType: defaultPurchaseType,
    selectedQuantity: 1,
    selectedVariantId: null
  }
}

const buildProducts = (shopifyProduct) => {
  if (!shopifyProduct) {
    return
  }
  const { isBundle, bundleProducts } = shopifyProduct.metadata
  if (isBundle) {
    return bundleProducts.map((x) => addDefaultProperties(x))
  }

  const x = [addDefaultProperties(shopifyProduct)]
  return x
}

export const state = () => ({
  activeProduct: null,
  globalPrepayData,
  loading: false,
  globalBannerData: null,
  globalModalContent: '',
  globalModalIsVisible: false,
  globalPromoCardData: null,
  sideModalContent: '',
  sideModalIsVisible: false,
  cartNotification: {
    show: false,
    title: ''
  },
  shopifyProduct: product,
  formProducts: buildProducts(product) || [{}]
})

export const getters = {
  activeProduct: (state) => {
    return state.activeProduct
  },
  globalModalContent: (state) => state.globalModalContent,
  globalModalIsVisible: (state) => state.globalModalIsVisible,
  globalPrepayData: (state) => {
    return state.globalPrepayData
  },
  globalPromoCardData: (state) => {
    return state.globalPromoCardData
  },
  globalPromoData: (state) => {
    return state.globalBannerData
  },
  loading: (state) => state.loading,
  product__:
    (state) =>
    (key = 0) => {
      const product = state.formProducts[key].product
      return product
    },
  products: (state) => state.formProducts.map((x) => x.product),

  purchaseType:
    (state) =>
    (key = 0) => {
      return state.formProducts[key].purchaseType
    },
  selectedQuantity:
    (state) =>
    (key = 0) => {
      return state.formProducts[key].selectedQuantity
    },
  selectedVariantId:
    (state) =>
    (key = 0) => {
      return state.formProducts[key].selectedVariantId
    },
  sideModalContent: (state) => state.sideModalContent,
  sideModalIsVisible: (state) => state.sideModalIsVisible,
  shopifyProduct(state) {
    return state.shopifyProduct || {}
  }
}

export const mutations = {
  getProduct: (state, key = 0) => {
    const product = state.formProducts[key].product
    return product
  },
  hideCartNotification(state) {
    state.cartNotification.show = false
  },
  setActiveProduct(state, product) {
    state.activeProduct = product
  },
  setGlobalBannerDataMutation(state, data) {
    state.globalBannerData = data
  },
  setGlobalPromoCardDataMutation(state, data) {
    state.globalPromoCardData = data
  },
  setProduct(state, product) {
    state.formProducts = [addDefaultProperties(product)]
    state.shopifyProduct = product
  },
  setPurchaseType__(state, { type, key }) {
    state.formProducts[key].purchaseType = type
  },
  setSelectedQuantity__(state, { key, quantity }) {
    state.formProducts[key].selectedQuantity = quantity
  },
  setSelectedVariantId__(state, { key, variantId }) {
    state.formProducts[key].selectedVariantId = variantId
  },
  setGlobalModalContent: (state, content) =>
    (state.globalModalContent = content.trim()),
  setSideModalContent: (state, content) =>
    (state.sideModalContent = content.trim()),
  showCartNotification(state, productTitle) {
    state.cartNotification = {
      title: productTitle,
      show: true
    }
  },
  showPageLoader: (state, bool) => (state.loading = bool),
  showGlobalModal: (state, bool) => (state.globalModalIsVisible = bool),
  showSideModal: (state, bool) => (state.sideModalIsVisible = bool),
  updateProduct__(state, { productInfo, key }) {
    state.formProducts[key].product = Object.assign(
      {},
      state.formProducts[key].product,
      productInfo
    )
  }
}

export const actions = {
  async getPromoBanner({ state, commit }) {
    if (state.globalBannerData) return state.globalBannerData

    const data = await this.$nacelle.data
      .content({
        handle: 'global-promo-banner',
        type: 'promoBanner'
      })
      .catch((error) => console.warn(error))

    commit('setGlobalBannerDataMutation', data)

    return data
  },
  async getGlobalPromoCard({ state, commit }) {
    if (state.globalPromoCardData) return state.globalPromoCardData

    const page = await this.$nacelle.data
      .content({ handle: 'collections-page', type: 'page' })
      .catch(() => {
        console.warn(`collections-all page not found`)
        return null
      })

    if (!page) return

    const { promoCard } = page.sections[0].fields
    commit('setGlobalPromoCardDataMutation', promoCard)

    return promoCard
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
