import { addPDPDataToProduct } from '../../helpers/product'

export const state = () => ({
  recommendedProducts: [],
  recomendedHandles: [
    'heating-patch',
    'cleansing-wipes-pouch',
    'liners',
    'personal-lubricant',
    'essential-oil-blend',
    'hand-sanitizer',
    'lola-pouch'
  ]
})

const buildProduct = async (handle, $nacelle) => {
  try {
    const product = await $nacelle.data.product({ handle })
    const recommendedProduct = await addPDPDataToProduct(product, $nacelle)
    return recommendedProduct
  } catch (error) {
    console.warn(error)
    return null
  }
}

export const getters = {
  getRecommendedProducts(state) {
    return state.recommendedProducts
  }
}

export const mutations = {
  addProductMutation(state, product) {
    const handle = { product }
    const index = state.recommendedProducts.findIndex(
      (product) => product.handle === handle
    )
    if (index === -1) {
      state.recommendedProducts.push(product)
    }
  },
  removeProductMutation(state, handle) {
    const index = state.recommendedProducts.findIndex(
      (product) => product.handle === handle
    )
    if (index !== -1) {
      state.recommendedProducts.splice(index, 1)
    }
  }
}

export const actions = {
  async setRecommendedProducts({ state, commit }) {
    const requests = state.recomendedHandles.map((handle) =>
      buildProduct(handle, this.$nacelle)
    )
    const products = await Promise.all(requests)
    products.forEach((product) => {
      if (product) commit('addProductMutation', product)
    })
  },
  async addProduct({ state, commit }, handle) {
    if (state.recomendedHandles.includes(handle)) {
      const product = await buildProduct(handle, this.$nacelle)
      commit('addProductMutation', product)
    }
  },
  removeProduct({ commit }, handle) {
    commit('removeProductMutation', handle)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
