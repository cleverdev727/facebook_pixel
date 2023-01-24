import account from '../store/account'
import assortment from '../store/assortment'
import blog from '../store/blog'
import cart from '../store/cart'
import checkout from '../store/checkout'
import collections from '../store/collections'
import commons from '../store/commons'
import events from '../store/events'
import global from '../store/global'
import modal from '../store/modal'
import quickView from '../store/quick-view'
import product from '../store/product/productModule'
import recommendations from '../store/product/recommendations'
import user from '../store/user'
import space from '../store/space'
import search from '../store/search'

export default () => {
  return {
    modules: {
      account,
      assortment,
      blog,
      cart,
      checkout,
      collections,
      commons,
      events,
      global,
      modal,
      'quick-view': quickView,
      product,
      recommendations,
      space,
      search,
      user
    }
  }
}
