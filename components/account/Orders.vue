<template>
  <client-only>
    <section class="account_orders">
      <div>
        <h2 class="order-history_heading">Buy it again</h2>
        <p class="order-history_desc">
          Loved your one time purchase? Easily reorder your faves using ‘Buy
          Again’!
        </p>
        <div v-if="buyAgain.length > 0" class="order-history">
          <div
            v-for="(line_item, index) in shownBuyAgain"
            v-show="showItem(line_item)"
            :key="index"
            class="buy-again_row"
          >
            <div
              class="buy-again_column buy-again_img"
              @click="showQuickAdd(line_item)"
            >
              <nuxt-img
                :src="getImageSrc(line_item, products)"
                class="fade img"
                :alt="line_item.product_title"
              />
            </div>
            <div class="buy-again_column buy-again_column-mobile">
              <span
                class="buy-again_product-title"
                @click="showQuickAdd(line_item)"
                >{{ line_item.product_title }}</span
              >
              <span class="buy-again_price">
                {{ getOneTimePrice(line_item) | dollarValue }}
              </span>
              <span class="buy-again_last"
                >Last ordered {{ line_item.shipped_date | date('short') }}</span
              >
            </div>
            <div class="buy-again_column buy-again_ctas buy-again_ctas-mobile">
              <quick-view-button
                class="button"
                cta-text="Buy again"
                :quick-add-product="getItem(line_item)"
              />
              <nuxt-link
                tag="button"
                class="button button--stripped"
                :to="getHandle(line_item) + '#reviews'"
                >Write review</nuxt-link
              >
            </div>
          </div>
          <div
            v-if="moreBuyAgain"
            class="order-history_pagination order-history_buy-pagination"
          >
            <span @click="seeMore('buyAgain')">{{ seeMoreText }}</span>
          </div>
        </div>
        <div v-else class="order-history order-history_none">
          <p>
            You haven’t placed a one time order...yet. Don’t be shy! We’ll meet
            you back here once your order is confirmed.
          </p>
          <nuxt-link to="/collections" class="button">Start shopping</nuxt-link>
        </div>
      </div>
      <div>
        <h2 class="order-history_heading">Order history</h2>
        <p class="order-history_desc">
          You can find information on all your previous one time and
          subscription purchases below.
        </p>
        <div v-if="orders.length > 0" class="order-history">
          <div>
            <div class="order-history_title">
              <span>Order Number </span>
              <span>Date</span>
            </div>
            <div class="orders-page">
              <div v-for="order in shownOrders" :key="order.shopify_order_id">
                <div class="order-history_row">
                  <span class="order-number" @click="showDetails(order.id)"
                    >#{{ order.shopify_order_number }}
                  </span>
                  <span>{{ order.created_at | date }}</span>
                </div>
                <order-detail v-show="orderId === order.id" :order="order" />
              </div>

              <div v-if="moreOrders" class="order-history_pagination">
                <span @click="seeMore('orders')">See more</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="order-history order-history_none">
          <p>There is no order history.</p>
          <nuxt-link to="/collections" class="button">Start shopping</nuxt-link>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import datePriceFilters from '@/mixins/datePriceFilters.js'
import account from '@/mixins/account'
import productMixin from '@/mixins/product'
import QuickViewButton from '@/components/lola/QuickViewButton.vue'
import OrderDetail from './OrderDetail.vue'

export default {
  components: { OrderDetail, QuickViewButton },
  mixins: [datePriceFilters, account, productMixin],
  props: {
    orders: {
      type: Array,
      default: () => {
        return []
      }
    },
    buyAgain: {
      type: Array,
      default: () => {
        return []
      }
    },
    products: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      shownOrders: this.orders.slice(0, 5),
      buyAgainCount: 3,
      orderId: null
    }
  },
  computed: {
    ...mapState('quick-view', ['quickViewVisible']),
    moreOrders() {
      return this.shownOrders.length < this.orders.length
    },
    moreBuyAgain() {
      return this.buyAgain.length > 3
    },
    seeMoreText() {
      return this.buyAgainCount < 4 ? 'see more' : 'see less'
    },
    shownBuyAgain() {
      return this.buyAgain.slice(0, this.buyAgainCount)
    }
  },
  watch: {
    orders(newValue, _) {
      this.shownOrders = newValue.slice(0, 5)
    }
  },
  methods: {
    ...mapMutations('quick-view', ['toggleQuickView']),
    seeMore(type) {
      if (type === 'orders') {
        const count = this.shownOrders.length
        if (this.moreOrders) {
          this.shownOrders = this.orders.slice(0, count + 5)
        }
      }
      if (type === 'buyAgain') {
        if (this.buyAgainCount < 4) {
          this.buyAgainCount = this.buyAgain.length
        } else {
          this.buyAgainCount = 3
        }
      }
    },
    showDetails(id) {
      this.orderId = this.orderId === id ? null : id
    },
    getItem(item) {
      const { shopify_product_id: productId, properties = [] } = item
      const product = this.getProduct(productId, properties, this.products)
      if (product) {
        // set prepaid default selection to onetime
        const product_ = JSON.parse(JSON.stringify(product))
        const { metadata } = product_
        metadata.prepaidDefaultSelection = 'onetime'
        metadata.assortmentSkus = this.getSkuString(properties)
        product_.metadata = metadata
        return product_
      }
      return {}
    },
    getOneTimePrice(item) {
      const product = this.getItem(item)
      return product?.priceRange?.min || item.price
    },
    showItem(item) {
      return Object.keys(this.getItem(item)).length !== 0
    },
    getHandle(item) {
      const { shopify_product_id: productId, properties = [] } = item
      const product = this.getProduct(productId, properties, this.products)
      return product ? `/products/${product.handle}` : ''
    },
    showQuickAdd(item) {
      const quickAddProduct = this.getItem(item)
      this.setProduct(quickAddProduct)
      this.updateSelectedVariantId()
      this.toggleQuickView()
    }
  }
}
</script>

<style lang="scss" scoped>
.account_orders {
  margin-top: 1em;
  padding-left: 1.2em;
  @media (min-width: $medium-screen) {
    grid-column: 1/3;
    display: grid;
    grid-template-columns: 1fr minmax(0, 1fr);
  }
}

.order-history {
  margin-bottom: 2em;
  margin-right: 1.2em;
  padding: 0 1em;
  box-shadow: 0px 4px 4px #dcdcdc, 4px 4px 4px rgba(220, 220, 220, 0.25);

  @media (max-width: $medium-screen) {
    padding: 0 0.5em;
  }

  &_heading {
    line-height: 42px;
    font-size: 20px;
    margin-bottom: 0;
  }

  &_desc {
    line-height: 26px;
    padding-right: 2em;
  }

  &_title {
    display: flex;
    justify-content: space-between;

    span {
      display: block;
      font-weight: bold;
      font-size: 14px;
      color: #4e6282;
      letter-spacing: 0.7px;
      text-transform: uppercase;
      padding-top: 1em;
    }
  }

  &_row {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f4f4f4;
    padding: 1em 0;

    span {
      display: block;
      font-size: 15px;
      @media (min-width: $medium-screen) {
        font-size: 18px;
      }
    }
    .order-number {
      cursor: pointer;
    }
  }

  &_pagination {
    padding: 1em 0;
    font-size: 13px;

    span {
      cursor: pointer;
      text-decoration: underline;
    }

    @media (min-width: $medium-screen) {
      font-size: 16px;
    }
  }

  &_buy-pagination {
    span {
      border-top: 1px solid #f4f4f4;
      display: block;
      padding-top: 1em;
    }
  }

  &_none {
    text-align: center;
    padding: 30% 6%;

    .button {
      font-size: 14px;
      margin: auto;
      width: 42%;

      @media (min-width: $medium-screen) {
        width: 30%;
      }
    }
  }

  .buy-again {
    &_row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      margin-top: 0.5em;

      @media (min-width: $medium-screen) {
        grid-template-columns: 1fr 2fr 1fr;
      }
    }

    &_column {
      display: flex;
      flex-flow: column;

      .button {
        font-size: 14px;
        height: 26px;
        width: 7em;
        margin-bottom: 10px;

        @media (max-width: $medium-screen) {
          margin-left: 0.5em;
        }
      }

      .img {
        width: 100px;
        height: auto;
        margin: 0.2em;
        margin-bottom: 0.8em;
      }
    }

    &_img {
      @media (max-width: $medium-screen) {
        grid-row: 1/3;
      }
      cursor: pointer;
    }

    &_column-mobile {
      @media (max-width: $medium-screen) {
        grid-column: 2/4;
        margin-left: 0.5em;
      }
    }

    &_ctas {
      @media (min-width: $medium-screen) {
        justify-self: flex-end;
      }
    }

    &_ctas-mobile {
      @media (max-width: $medium-screen) {
        flex-flow: row;
        grid-column: 2/4;
        padding-top: 0.3em;
      }
    }

    &_price {
      font-size: 14px;
    }

    &_last {
      font-size: 12px;
    }

    &_product-title {
      color: #4e6282;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
