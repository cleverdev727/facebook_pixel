<template>
  <li
    class="app-navigation__item app-navigation__item-none app-navigation__item--cart"
  >
    <a
      class="app-navigation__link gtm-nav-cart app-navigation__link-border-cart cart-icon"
      @click="toggleCart"
    >
      <span class="cart-icon">
        <cart-icon class="cart-icon" />
      </span>
      <client-only>
        <span v-if="quantityTotal > 0" class="cart-count">
          {{ quantityTotal }}
        </span></client-only
      >
    </a>
  </li>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import CartIcon from '../lola/icons/CartIcon.vue'

export default {
  components: { CartIcon },
  computed: {
    ...mapGetters('cart', ['quantityTotal'])
  },
  methods: {
    ...mapMutations('cart', ['toggleCart'])
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 2em;
  height: 2em;
}

.main-nav-cart {
  position: relative;
  background: none;
  border: 0;
  outline: 0;
  cursor: pointer;
  text-align: right;
  color: #3b3b3b;
}

.main-nav-cart.nacelle:hover,
.main-nav-cart.nacelle:focus {
  opacity: 0.8;
}

.main-nav-cart.nacelle .cart-count {
  background-color: #3b3b3b;
  color: #fff;
  border: 2px solid #fff;
  font-weight: 600;
  width: 1.75em;
  height: 1.75em;
  -webkit-transform: translate3d(2px, -4px, 0);
  transform: translate3d(2px, -4px, 0);
}
.app-navigation__link {
  cursor: pointer;
}

.cart-icon {
  position: relative;
}

html.search-open {
  .cart-icon {
    display: none !important;
  }
}
</style>
