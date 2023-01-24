<template>
  <section>
    <pdp-addresses :initial-selected-address="selectedAddress" />
    <product />
  </section>
</template>

<script>
import product from '@/pages/products/_productHandle'

export default {
  components: {
    product
  },
  middleware: 'authenticated',
  computed: {
    selectedAddress() {
      return this.$route.query?.address
    }
  }
}
</script>
