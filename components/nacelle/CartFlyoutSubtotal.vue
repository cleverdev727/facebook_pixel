<template>
  <div v-show="cartSubtotal" class="subtotal">
    <slot :subtotal="cartSubtotal">
      <div class="subtotal-bold">
        <span>Subtotal</span>
        <span class="subtotal-right">
          <product-price v-bind="productPriceProps" class="price" />
        </span>
      </div>
      <div v-if="!cartContainsOnlyDigitalProduct">
        <span>Shipping</span>
        <span class="subtotal-right">{{ shippingCost }}</span>
      </div>
    </slot>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import cartMixin from '@/mixins/cart'

export default {
  mixins: [cartMixin],
  props: {
    titleTag: {
      type: String,
      default: 'h4'
    }
  },
  computed: {
    ...mapGetters('cart', ['cartSubtotal', 'freeShippingThresholdPassed']),
    ...mapState('user', ['locale']),

    productPriceProps() {
      return {
        price: this.cartSubtotal,
        currencyCode: this.locale.currency
      }
    },

    shippingCost() {
      return this.freeShippingThresholdPassed
        ? 'Free'
        : new Intl.NumberFormat(this.locale, {
            style: 'currency',
            currency: this.locale.currency
          }).format(5)
    }
  }
}
</script>

<style lang="scss" scoped>
.subtotal {
  & > div {
    padding: 0.8rem 1rem 0;
  }
  .subtotal-bold {
    font-weight: 700;
  }
  .subtotal-right {
    float: right;
  }
}
</style>
