<template>
  <div class="account">
    <account-header />
    <section class="account__content">
      <div class="subscriptions-content">
        <customer-card :customer="customer" :membership-sub="membershipSub" />
        <div v-if="loading" class="account-loader">
          <div class="lds-dual-ring"></div>
        </div>
        <div v-else>
          <subscriptions
            :active-addresses="activeAddresses"
            :subscriptions="nonMembershipSubscriptions"
            :products="products"
          />
          <account-upsells
            v-if="showUpsells"
            :products="productRecommendations"
          />
        </div>
        <help />
        <div>
          <nuxt-link
            class="subscription-logout button"
            to="#"
            @click.native="handleLogout()"
          >
            Log out
          </nuxt-link>
        </div>
      </div>
      <account-notification />
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import collectionsModule from '~/store/collections'

export default {
  middleware: 'authenticated',
  data() {
    return {
      loading: true
    }
  },
  async fetch() {
    // fetch recharge product collection for mapping subscription to a product handle.
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
    this.loading = false
  },
  head() {
    return {
      script: [
        {
          src: 'https://rawgit.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.min.js'
        }
      ]
    }
  },
  computed: {
    ...mapState('account', [
      'customer',
      'addresses',
      'subscriptions',
      'onetimes'
    ]),
    ...mapState('collections', ['collections']),
    activeAddresses() {
      // address with subscriptions - remove membership address
      const addresses = this.nonMembershipSubscriptions.map(
        (subscription) => subscription.address_id
      )
      const uniqueAddresses = [...new Set(addresses)]
      return this.addresses.filter((address) =>
        uniqueAddresses.includes(address.id)
      )
    },
    showUpsells() {
      return this.activeAddresses.length > 0
    },
    nonMembershipSubscriptions() {
      const subscriptions = this.subscriptions.filter(
        (sub) => sub.sku !== 'LOLA Membership'
      )
      return subscriptions.concat(this.onetimes)
    },
    membershipSub() {
      return this.subscriptions.find((sub) => sub.sku === 'LOLA Membership')
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
    },
    productRecommendations() {
      const handles = [
        'personal-lubricant',
        'essential-oil-blend',
        'condoms',
        'liners',
        'cleansing-wipes-pouch',
        'heating-patch',
        'probiotic-supplement',
        'pleasure-gel'
      ]
      return this.products.filter((product) => handles.includes(product.handle))
    }
  },
  methods: {
    ...mapActions('account', ['logout']),
    handleLogout() {
      // GA - dataLayer
      window.dataLayer = window.dataLayer.filter(
        (obj) => obj.customer === undefined
      )
      this.logout().then(() => {
        this.$router.push({ path: '/' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.subscriptions-content {
  @media (min-width: 960px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
  }
}

.subscription-logout {
  margin: 2em;

  @media (min-width: $medium-screen) {
    display: none;
  }
}
</style>
