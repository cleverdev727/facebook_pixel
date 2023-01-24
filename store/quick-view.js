export const state = () => ({
  quickViewVisible: false
})

export const mutations = {
  setQuickViewVisible(state, bool) {
    state.quickViewVisible = bool
  },
  toggleQuickView(state) {
    state.quickViewVisible = !state.quickViewVisible
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
