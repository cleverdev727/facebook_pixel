<template>
  <div class="flyout-cart-header">
    <div class="top">
      <messaging-free-shipping-counter
        :style="{
          visibility: cartContainsOnlyDigitalProduct ? 'hidden' : 'initial'
        }"
      >
        <span v-if="!freeShippingThresholdPassed">
          <slot name="no-free-shipping" :amount="amountUntilFreeShipping">
            You're
            <strong class="threshold"
              ><product-price v-bind="productPriceProps" :rounded="true"
            /></strong>
            away from free shipping!
          </slot>
        </span>
        <span v-else>
          <slot name="free-shipping"> You get free shipping! </slot>
        </span>
      </messaging-free-shipping-counter>
      <slot name="close-button">
        <div class="close" @click="close">
          <close-icon />
        </div>
      </slot>
    </div>
    <div v-show="!cartContainsOnlyDigitalProduct" class="shipping-progress">
      <progress-bar :value="shippingProgressValue" />
    </div>
    <h3
      v-if="lineItems.length > 0"
      class="cart-heading fw-md"
      :class="{ 'mt-0': cartContainsOnlyDigitalProduct }"
    >
      Your cart
    </h3>
  </div>
</template>

<script>
import cartMixin from '@/mixins/cart'
import { nearestPercent } from '@/lib/math'
import { mapGetters, mapState } from 'vuex'
import MessagingFreeShippingCounter from '@/components/nacelle/MessagingFreeShippingCounter'
import ProductPrice from '@/components/nacelle/ProductPrice'
import ProgressBar from '@/components/lola/ProgressBar'
import CloseIcon from '../lola/icons/CloseIcon.vue'
export default {
  components: {
    CloseIcon,
    MessagingFreeShippingCounter,
    ProductPrice,
    ProgressBar
  },
  mixins: [cartMixin],
  computed: {
    ...mapGetters('cart', [
      'freeShippingThresholdPassed',
      'freeShippingThreshold',
      'amountUntilFreeShipping'
    ]),
    ...mapState('user', ['locale']),
    ...mapState('cart', ['lineItems']),

    productPriceProps() {
      return {
        price: this.amountUntilFreeShipping,
        currencyCode: this.locale.currency
      }
    },
    shippingProgressValue() {
      const currentAmount =
        this.freeShippingThreshold - this.amountUntilFreeShipping
      return nearestPercent(this.freeShippingThreshold, currentAmount, 25) // 25% intervals
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.flyout-cart-header {
  display: flex;
  flex-direction: column;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .flyout-cart-hearder-title {
    font-size: 16pt;
    font-weight: 700;
    text-align: center;
  }

  .close {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;

    ::v-deep {
      > svg {
        fill: $dark-brown;
      }
    }
  }

  .cart-heading {
    color: $dark-blue;
    margin: 23px 0 16px;
  }

  .shipping-progress {
    margin-top: 16px;
  }
}
</style>
