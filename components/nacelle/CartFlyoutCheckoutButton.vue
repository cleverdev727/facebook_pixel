<template>
  <div
    class="button checkout-button"
    :class="{ 'is-loading': loading }"
    :disabled="loading"
    role="button"
    @click="checkout"
  >
    {{ checkoutText }}
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  props: {
    checkoutText: {
      type: String,
      default: 'Checkout'
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    ...mapMutations('cart', ['setCartError']),
    ...mapActions('checkout', ['processCheckout']),
    async checkout() {
      this.loading = true
      try {
        await this.processCheckout({
          async beforeCreate() {
            // Allows processing of cart before checkout creation.
          },
          async beforeRedirect() {
            // Allows processing after checkout create and before redirecting.
          }
        })
      } catch (err) {
        this.setCartError(err)
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-button {
  margin-top: 30px;
  @supports (-webkit-touch-callout: none) {
    margin-bottom: 10px;
  }
}
.button {
  border: none !important;

  &.is-loading {
    background-color: lighten($dark-blue, 15) !important;
    pointer-events: none;
  }
  &:hover {
    color: #fff;
    background-color: darken($dark-blue, 5);
  }
}
</style>
