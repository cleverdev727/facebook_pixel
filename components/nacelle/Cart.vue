<template>
  <div>
    <div v-show="cartVisible" class="overlay" @click="handleClose"></div>
    <transition name="slide">
      <div v-show="cartVisible" class="flyout">
        <cart-flyout-header @close="handleClose" />
        <div v-if="lineItems.length > 0" class="cart-items">
          <cart-item
            v-for="{ metadata, ...item } in lineItems"
            :key="item.variant.id"
            :item="item"
            :metadata="metadata"
          ></cart-item>
        </div>
        <cart-empty v-else />
        <div style="padding-top: 20px">
          <cart-recommendations
            v-if="recommendedProducts.length > 0"
            :items="recommendedProducts.slice(0, 3)"
          />
          <div v-show="lineItems.length > 0" class="checkout">
            <cart-flyout-subtotal />
            <cart-flyout-checkout-button />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import CartEmpty from '@/components/lola/CartEmpty'
import CartRecommendations from '@/components/lola/CartRecommendations'
export default {
  components: { CartEmpty, CartRecommendations },
  computed: {
    ...mapState('cart', ['lineItems', 'cartVisible']),
    ...mapState('product/recommendations', ['recommendedProducts'])
  },
  watch: {
    lineItems(newValue) {
      if (newValue.length === 0) {
        this.hideCart()
      }
    },
    cartVisible(visible) {
      const solvvy = document.getElementById('solvvy-container')
      if (solvvy) {
        visible
          ? solvvy.classList.add('hide-elem')
          : solvvy.classList.remove('hide-elem')
      }
    }
  },
  methods: {
    ...mapMutations('cart', [
      'showCart',
      'hideCart',
      'setFreeShippingThreshold'
    ]),
    handleClose() {
      this.hideCart()
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #00000010;
}

.flyout {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
  padding: 20px;
  max-width: 420px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 999;
  transition: ease-in-out transform 250ms;
  display: flex;
  flex-direction: column;

  &-body {
    display: flex;
    flex-direction: column;
  }

  &:focus {
    outline: none;
  }

  .cart-items {
    flex: 1;
    overflow-y: auto;
  }

  .nocontent {
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .checkout {
    border-top: 1px solid $dark-blue;
    font-size: 14px;
  }

  .flyout-recommendation {
    margin-bottom: 26px;
    h4 {
      font-size: 1rem;
      font-weight: 700;
      padding: 0 0 0.5rem;
    }
  }

  @media only screen and (max-width: $medium-screen) {
    padding-left: 16px;
    padding-right: 16px;
  }
}

.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(100%);
}
</style>
