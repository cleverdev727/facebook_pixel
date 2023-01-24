<template>
  <span>{{ displayPrice }}</span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    price: {
      type: [String, Number],
      default: ''
    },
    currencyCode: {
      type: [String, null],
      default: null
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('user', ['locale']),

    displayPrice() {
      const { price, currencyCode, locale } = this

      if (this.rounded) {
        return locale.symbol + price.toString().replace(/(\.00)$/, '')
      }

      if (currencyCode === locale.currency) {
        return new Intl.NumberFormat(locale.locale, {
          style: 'currency',
          currency: currencyCode
        }).format(price)
      }
      return price
    }
  }
}
</script>
