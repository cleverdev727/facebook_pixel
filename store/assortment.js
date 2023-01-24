export const state = () => ({
  additionalSkuInfo: null,
  assortmentOptionsInfo: null,
  assortmentTabInfo: null,
  cache: {
    assortmentUpdateData: null
  },
  productUpdateData: { cartIsFull: true },
  initialAssortment: null,
  showPopup: false
})

export const mutations = {
  setAdditionalSkuInfo(state, skuInfo) {
    state.additionalSkuInfo = skuInfo
  },
  setAssortmentOptionsInfo(state, assortmentInfo) {
    state.assortmentOptionsInfo = assortmentInfo
  },
  setAssortmentTabInfo(state, assortmentTabInfo) {
    state.assortmentTabInfo = assortmentTabInfo
  },
  setCache(state, source) {
    state.cache.assortmentUpdateData = source
  },
  setProductUpdateData(state, updateData) {
    state.productUpdateData = updateData
  },
  setInitialAssortment(state, assortment) {
    state.initialAssortment = assortment
  },
  setShowPopup(state, show) {
    state.showPopup = show
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
