import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key: 'lola',
    storage: window.localStorage,
    reducer: (state) => ({
      account: state.account
    })
  }).plugin(store)

  new VuexPersistence({
    key: 'checkoutId',
    storage: window.localStorage,
    reducer: (state) => state.checkout.id
  }).plugin(store)
}
