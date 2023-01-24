<template>
  <section>
    <div class="account">
      <account-header />
      <section class="account__content">
        <customer-card :customer="customer" />
        <orders
          :buy-again="recentSixOneTimeProducts"
          :orders="orders"
          :products="products"
        />
        <help />
      </section>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import collectionsModule from '~/store/collections'

export default {
  middleware: 'authenticated',
  async fetch() {
    // fetch recharge product collection
    const namespace = 'collections'
    if (!this.$store.hasModule(namespace)) {
      this.$store.registerModule(namespace, collectionsModule, {
        preserveState: !!this.$store.state[namespace]
      })
    }
    await this.$store.dispatch(
      `${namespace}/getCollection`,
      'recharge-products'
    )
  },
  computed: {
    ...mapState('account', ['customer', 'orders']),
    ...mapState('collections', ['collections']),
    recentSixOneTimeProducts() {
      // returns maximum of 6 buy agains
      const products = this.orders
        .filter((order) => order.line_items.length > 0)
        .map((order) => {
          const items = order.line_items.map((item) => {
            // LOLA-944 Remove Daily Multivitamin from line items
            const isMultivitamin = item.sku === 'CCSUP'
            const isSubscription = item.properties.some((prop) =>
              prop.name.includes('shipping_interval_frequency')
            )
            if (!isSubscription && !isMultivitamin) {
              return {
                ...item,
                shipped_date: order.shipped_date
              }
            }
            return null
          })
          return items.filter(Boolean)
        })
        .flat()

      return products
        .reduce((uniq, curr) => {
          if (!uniq.some((prev) => prev.sku === curr.sku)) {
            uniq.push(curr)
          }
          return uniq
        }, [])
        .slice(0, 6)
    },
    products() {
      const recharge = this.collections.find(
        (x) => x.handle === 'recharge-products'
      )
      const recharge_ = { ...recharge }
      if ('products' in recharge_) {
        return recharge_.products
      }
      return []
    }
  }
}
</script>
