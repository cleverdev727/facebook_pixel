<template>
  <li class="product">
    <div class="product--image">
      <nuxt-link
        :to="'/products/' + product.handle"
        class="gtm-product-card-cardboard-applicator-tampons"
      >
        <nuxt-img
          :src="getProductSrc(product)"
          class="fade"
          :alt="product.title"
        />
        <span v-if="promoBadge" class="product--saving-badge">
          {{ promoBadge }}
        </span>
      </nuxt-link>
    </div>
    <div class="product--details">
      <div class="copy">
        <nuxt-link :to="'/products/' + product.handle">
          <p class="title">{{ product.title }}</p>
        </nuxt-link>
      </div>
      <div class="price">
        <span>Starting at</span>
        <span>${{ startingPrice }}</span>
      </div>
    </div>
    <div v-if="!outOfStock(product)" class="quick-add-panel">
      <div class="product--image">
        <nuxt-link :to="'/products/' + product.handle">
          <nuxt-img :src="lastImage" class="fade" alt="" />
        </nuxt-link>
        <template v-if="usesQuickView">
          <quick-view-button :quick-add-product="product" />
        </template>
        <template v-else>
          <button class="add-btn" @click.prevent="addToCart(product)">
            {{ buttonText }}
          </button>
        </template>
      </div>
      <div class="product--details">
        <div class="copy">
          <nuxt-link :to="'/products/' + product.handle">
            <p class="title">{{ product.title }}</p>
          </nuxt-link>
          <span class="description">
            {{ shortDescription || '' }}
          </span>
        </div>
        <div class="price">
          <span>Starting at</span>
          <span>${{ startingPrice }}</span>
          <span></span>
        </div>
      </div>
    </div>
    <div class="shop--cta">
      <template v-if="usesQuickView">
        <quick-view-button
          :quick-add-product="product"
          class="button button--stripped"
        />
      </template>
      <template v-else>
        <a
          class="add-btn button button--stripped"
          :href="`/products/${product.handle}`"
          :disabled="isOutOfStock"
          @click.prevent="addToCart(product)"
          >{{ buttonText }}</a
        >
      </template>
    </div>
  </li>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import QuickViewButton from '@/components/lola/QuickViewButton.vue'
import {
  getAdditionalSkuInfo,
  isOutOfStock,
  isGiftCard,
  getStartingPrice
} from '~/helpers/product'
import subscriptions from '~/mixins/subscriptions'
import { imagePlaceholder } from '~/helpers/general'

const DEFAULT_BUTTON_TEXT = 'Add to cart'

export default {
  components: {
    QuickViewButton
  },
  mixins: [subscriptions],
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      buttonText: DEFAULT_BUTTON_TEXT,
      form: null
    }
  },
  computed: {
    lastImage() {
      let src = ''
      this.product.media.forEach((m) => {
        if (m.type === 'image') {
          src = m.src
        }
      })

      return src
    },
    promoBadge() {
      return this.product.metadata?.promoBadge
    },
    shortDescription() {
      return this.product.metadata?.shortDescription
    },
    startingPrice() {
      return getStartingPrice(this.product)
    },
    usesQuickView() {
      const { useSizeSelector, assortmentSkus } = this.product.metadata || {}
      return (
        isGiftCard(this.product) ||
        useSizeSelector ||
        assortmentSkus?.length > 0
      )
    },
    isOutOfStock() {
      return isOutOfStock(this.product, this.product.tags)
    }
  },
  mounted() {
    if (this.isOutOfStock) {
      this.buttonText = 'Out of stock'
    }
  },
  methods: {
    ...mapActions('cart', ['addLineItem']),
    ...mapMutations('global', ['showCartNotification']),
    addToCart(product) {
      if (this.isOutOfStock) {
        return false
      }

      const metafields = [
        {
          key: 'charge_interval_frequency',
          value: null
        },
        {
          key: 'product_type',
          value: 'otp'
        }
      ]

      if (product.metadata?.isValuePack) {
        metafields.push({ key: 'fulfillable_quantity', value: '8' })
      }

      // Add additional SKUs if they exist
      const additionalInfo = getAdditionalSkuInfo(product)
      Object.keys(additionalInfo).forEach((key) => {
        metafields.push({
          key: `_SKU:${key}`,
          value: additionalInfo[key].toString()
        })
      })

      const lineItem = {
        image: product.featuredMedia,
        title: product.title,
        variant: product.variants[0],
        metafields,
        quantity: 1,
        productId: product.id,
        handle: product.handle,
        vendor: product.vendor,
        tags: product.tags,

        metadata: product.metadata
      }
      this.addLineItem(lineItem)
      this.buttonText = 'Added!'
      this.showCartNotification(lineItem.title)
      setTimeout(() => {
        this.buttonText = DEFAULT_BUTTON_TEXT
      }, 2000)
    },
    getProductSrc(product) {
      const { media } = product
      if (media?.length > 0) {
        return media[0].src
      }
      return imagePlaceholder
    },
    outOfStock(product) {
      return isOutOfStock(product, product.tags)
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes scale-display--reversed {
  0% {
    display: block;
    opacity: 1;
  }

  99% {
    display: block;
    opacity: 0;
  }

  100% {
    display: none;
    opacity: 0;
  }
}

.product {
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
  max-width: 265px;

  &--image {
    position: relative;

    > a {
      display: block;
    }
  }

  &--saving-badge {
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    font-size: 12px;
    color: #fff;
    background: #6e8db1;
    border-radius: 4px 0px 0px 4px;
    padding: 0.3em 0.6em;
    position: absolute;
    right: 0;
    top: 2em;
  }

  &--details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    color: $dark-blue;

    .copy {
      padding-right: 10px;

      a {
        text-decoration: none;
        color: $dark-blue;
        &:hover {
          color: initial;
        }
      }

      .title {
        font-size: 16px;
        font-family: 'Apercu Medium', sans-serif;
        font-weight: normal;
        line-height: 20px;
        margin-bottom: 4px;
      }

      .description {
        font-family: 'Apercu Light', sans-serif;
        font-size: 14px;
        line-height: 1;
      }
    }

    .price {
      font-size: 15px;

      .count {
        display: none;
      }
    }
  }

  .quick-add-panel {
    display: none; // hiding this until quick-add is added
    position: absolute;
    left: -15px;
    right: -15px;
    top: -15px;
    padding: 15px;
    border-radius: 2px;
    box-shadow: 0 3px 6px #00000029;
    z-index: 55;
    background-color: #fff;
    animation: scale-display--reversed 0.3s;

    ::v-deep {
      .add-btn {
        position: absolute;
        text-decoration: none;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        padding: 10px 15px;
        background: $dark-blue;
        color: #fff;
        width: 100%;
        border-radius: 0;
        border: 0;
        height: auto;

        &:hover {
          background-color: lighten($dark-blue, 15);
        }

        &:focus {
          outline: none;
          background-color: lighten($dark-blue, 15);
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      }
    }

    .product--image {
      margin-bottom: 10px;
    }
  }

  .shop--cta {
    width: 100%;
    margin: auto auto 20px;
    padding-top: 8px;
    display: none;

    ::v-deep {
      .add-btn {
        width: 100%;
        height: 30px;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        line-height: 22px;
        color: $dark-blue;
        border-color: $dark-blue;

        &:hover {
          background-color: transparent;
          opacity: 0.9;
        }
      }

      .add-btn[disabled] {
        cursor: not-allowed;
        opacity: 0.5 !important;
      }
    }
  }

  &:hover {
    .quick-add-panel {
      display: block;
      animation: scale-display 0.3s;
    }
  }

  @media screen and (max-width: 600px) {
    min-width: 240px;
    scroll-snap-align: start;
    align-items: start;
    grid-gap: 0 43px;

    .quick-add-panel {
      display: none !important;
    }

    &--details {
      display: block;

      .copy {
        min-height: auto;

        .title {
          font-size: 14px;
        }
      }

      .price {
        font-size: 12px;

        .count {
          display: inline;
        }
      }
    }

    .shop--cta {
      display: block;

      a {
        position: relative;
        overflow: hidden;

        .box-message {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          color: $dark-blue;
          transition: all 0.3s ease-in-out;
          transform: translateY(100%);

          &.reveal {
            transform: translateY(0);
          }
        }
      }
    }
  }
}
</style>
