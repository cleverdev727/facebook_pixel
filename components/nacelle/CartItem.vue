<template>
  <div class="flyout-cart-item">
    <nuxt-img
      v-if="productThumbnail && productThumbnail.length > 0"
      :src="productThumbnail"
      :alt="item.title"
      height="100"
      width="100"
    />
    <div class="item-content">
      <div class="flex justify--space-between flex--items-center">
        <h4 class="item-title fw-md text--blue">{{ item.title }}</h4>
        <cart-flyout-item-remove-button :line-id="item.variant.id" />
      </div>
      <div
        v-if="isCustom"
        class="assortment-count-details"
        v-html="assortmentText"
      ></div>
      <div v-else class="assortment-count-details">
        {{
          metadata.quantityInfo +
          (metadata.usesSizeSelector ? `/${item.variant.title}` : '')
        }}
      </div>
      <div v-if="!hideSubInfo" class="subscription-info">
        <template v-if="isPrepayProduct || isValuePack">
          <span v-if="isPayG" class="text--light payg">
            <span class="text">
              Go with your flow / Delivered every
              {{
                frequency > 4
                  ? `${frequency / 4} ${pluralize('month', frequency / 4)}`
                  : `${frequency} ${pluralize(orderIntervalUnit, frequency)}`
              }}
            </span>
          </span>
          <span v-else class="text--light">
            <span>{{
              `${prepaidItemQty} ${pluralize(
                metadata.containerText,
                prepaidItemQty
              )}`
            }}</span>
            delivered every
            {{
              frequency > 4
                ? `${frequency / 4} months`
                : `${frequency} ${pluralize(orderIntervalUnit, frequency)}`
            }}
          </span>
        </template>
        <template v-else-if="isOneTimeProduct">
          <p v-if="metadata.subscriptionId" class="one-time__text">
            <span class="text--light"> One-time purchase &nbsp;</span>
            <input type="checkbox" class="checkbox" />
            <span
              v-if="!isDailyMultivitamin"
              class="light--text subscribe-activate"
              @click="subscribeToSave"
            >
              <span>Subscribe to Save {{ subscriptionDiscount }}</span>
              <span class="info">
                <span>?</span>
                <span class="tip">
                  Subscribe to save money. Choose your quantity and frequency.
                  Skip, modify, or cancel at any time. We’ll remind you.
                </span>
              </span>
            </span>
          </p>
        </template>
        <template v-else>
          <span class="text">
            Subscribe to save / Delivered every
            {{
              frequency > 4
                ? `${frequency / 4} months`
                : `${frequency} ${pluralize(orderIntervalUnit, frequency)}`
            }}
          </span>
        </template>
      </div>
      <div class="item-content__inner">
        <quantity-selector
          :item="item"
          :quantity="item.quantity"
          :disabled="disableSelector"
          @change="handleQuantityChange"
        />
        <div>
          <product-price
            :price="itemPrice"
            :currency-code="item.variant.priceCurrency"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import {
  getAssortmentCountText,
  isOneTimeProduct,
  itemPrice,
  convertMetafieldsToObject
} from '@/helpers/product'
import { pluralize } from '@/helpers/strings'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    metadata: {
      type: Object,
      required: true
    },
    pathFragment: {
      type: String,
      default: '/products/'
    }
  },
  data() {
    return {
      pluralize
    }
  },
  computed: {
    assortmentText() {
      return getAssortmentCountText(this.skuProps)
    },
    disableSelector() {
      return this.metadata.isValuePack || this.isMembershipProduct
    },
    frequency() {
      const { orderIntervalFrequency = 0 } = this.metafields
      return parseInt(orderIntervalFrequency)
    },
    fulfillableQuantity() {
      return parseInt(this.metafields.fulfillableQuantity || 0)
    },
    hideSubInfo() {
      if (this.isMembershipProduct) return true
      return this.isOneTimeProduct && !this.metadata.subscriptionId
    },
    isCustom() {
      return Object.keys(this.skuProps).length > 0
    },
    isPayG() {
      return this.metafields.prepaySubscriptionType === 'payg'
    },
    isMembershipProduct() {
      return this.item.productType?.toLowerCase() === 'membership'
    },
    isPrepayProduct() {
      return this.metafields.prepaySubscriptionType
    },
    isValuePack() {
      return this.metadata.isValuePack
    },
    itemPrice() {
      return itemPrice(this.item, this.metadata)
    },
    orderIntervalUnit() {
      return this.metafields.orderIntervalUnit
    },
    prepaidItemQty() {
      const { fulfillableQuantity } = this.metafields
      return parseInt(fulfillableQuantity)
    },
    productThumbnail() {
      return this.item?.image?.thumbnailSrc
    },
    subscriptionDiscount() {
      const { oneTimePrice, subscriptionPrice } = this.metadata
      return (
        Math.floor(((oneTimePrice - subscriptionPrice) * 100) / oneTimePrice) +
        '%'
      )
    },
    skuProps() {
      return Object.keys(this.metafields).reduce((acc, curr) => {
        if (curr.startsWith('_SKU:')) {
          acc[curr] = this.metafields[curr]
        }
        return acc
      }, {})
    },
    isOneTimeProduct() {
      return isOneTimeProduct(this.metafields)
    },
    metafields() {
      return convertMetafieldsToObject(this.item.metafields)
    },
    isDailyMultivitamin() {
      return this.item.handle === 'daily-supplement'
    }
  },
  methods: {
    ...mapMutations('cart', ['hideCart', 'showCart']),
    ...mapMutations('global', ['showPageLoader']),
    ...mapActions('cart', ['addLineItem', 'removeLineItem', 'updateLineItem']),
    handleQuantityChange(quantity) {
      const { fulfillableQuantity } = this.metafields
      if (!fulfillableQuantity) return

      const metafields = this.item.metafields.filter(
        (x) => x.key !== 'fulfillable_quantity'
      )
      metafields.push({
        key: 'fulfillable_quantity',
        value: (this.frequency / 4) * quantity + ''
      })

      this.updateLineItem({ ...this.item, metafields, quantity })
    },
    async subscribeToSave() {
      const { handle, metafields, quantity, variant } = this.item

      try {
        this.showPageLoader(true)
        // Remove current line item
        this.removeLineItem(variant.id)

        // Add modified one
        // 1. Remove metafield that sets charge frequency as null
        let newMetafields = metafields.filter(
          (x) => x.key !== 'charge_interval_frequency'
        )

        // 2. Add subscription metafields
        newMetafields = [
          ...newMetafields,
          {
            key: 'charge_interval_frequency',
            value: '4'
          },
          {
            key: 'order_interval_frequency',
            value: '4'
          },
          {
            key: 'order_interval_unit',
            value: 'week'
          }
        ]

        // 3. Fetch product from nacelle
        const product = await this.$nacelle.data.product({ handle })

        // 4. Build line item
        const lineItem = {
          image: product.featuredMedia,
          title: product.title,
          variant,
          quantity,
          productId: product.id,
          handle: product.handle,
          vendor: product.vendor,
          tags: product.tags,
          metafields: newMetafields,
          metadata: this.metadata
        }

        this.addLineItem(lineItem)
        // The cart slides out of view if the current
        // cart item is the only one. Bring it back
        // into view after adding the modified item
        this.showCart()
      } catch (error) {
        console.error(error)
        alert('An error occurred. Please try again later.')
      }

      this.showPageLoader(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.flyout-cart-item {
  display: grid;
  grid-template-columns: [col] auto [col] 1fr [col];
  grid-template-rows: [row] auto [row] auto;
  grid-column-gap: 1rem;
  margin-bottom: 14px;
  padding-bottom: 10px;

  .subscription-info {
    grid-column: col / span 3;
    grid-row: row 2;
    margin-top: 8px;
    font-size: 12px;
    font-family: 'Apercu Pro', sans-serif;

    .payg {
      display: flex;
      align-items: center;

      .selector {
        width: auto;
      }
    }

    .one-time__text {
      margin: 0;

      .checkbox {
        width: 0;
        height: 0;
        visibility: hidden;
        margin: 0 0 0 15px;
      }

      .checkbox + .subscribe-activate::before {
        content: '\A0';
        display: inline-block;
        margin: 0 0.25em 0 0;
        width: 10px;
        height: 10px;
        border: 1.3px solid #6e8db1;
        border-radius: 3px;
        cursor: pointer;
      }

      .subscribe-activate {
        font: normal 12px/23px 'Apercu Pro', sans-serif;
        color: $dark-blue;
        align-items: center;
        position: relative;
        display: flex;
        line-height: 1.3;
        padding-top: 3px;
      }

      .info {
        width: 11px;
        height: 11px;
        background: #4e6282;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        margin-left: 4px;
        cursor: pointer;
      }

      .tip {
        position: absolute;
        top: 100%;
        right: -50%;
        display: none;
        background: #e0e3e9;
        border-radius: 5px;
        width: 300px;
        padding: 8px;
        text-transform: none;
        color: #514945;
        font-weight: 400;
      }

      .info:hover .tip {
        display: block;
      }

      @media (max-width: $medium-screen) {
        display: block;

        .subscribe-activate {
          margin-top: 8px;
        }
      }
    }
  }
  a {
    text-decoration: none;
    h4 {
      font-size: 1.1rem;
      font-weight: 700;
      line-height: inherit;
    }
  }
  .item-variant {
    margin: 0 0 0.5rem;
  }
  .item-content {
    display: flex;
    flex-direction: column;
    .item-content__inner {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;

      .item-content__inner-link {
        border-left: 1px solid #514945;
        a {
          text-decoration: underline;
          padding-left: 10px;
        }
        @media (max-width: $medium-screen) {
          border: none;
          a {
            padding: 0;
          }
        }
      }
    }
  }

  .assortment-count-details {
    font-size: 12px;
  }
}
</style>
