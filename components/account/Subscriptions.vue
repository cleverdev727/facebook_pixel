<template>
  <client-only>
    <section class="subscription-section">
      <p class="subscriptions_title">My subscriptions</p>
      <div
        v-for="(address, index) in activeAddresses"
        :key="address.id"
        class="subscription-card"
        :class="'subscription-card-' + address.id"
      >
        <address-item
          :address="address"
          :index="index"
          :subscriptions="addressSubs(address.id)"
          :products="products"
        />
      </div>
      <div v-if="activeAddresses.length === 0">
        <p class="subscription-none">You have no active subscriptions</p>
      </div>
    </section>
  </client-only>
</template>

<script>
export default {
  props: {
    activeAddresses: {
      type: Array,
      default: () => {
        return []
      }
    },
    subscriptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    products: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    addressSubs(addressId) {
      return this.subscriptions.filter(
        (subscription) => subscription.address_id === addressId
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.subscription-section {
  @media (min-width: 960px) {
    display: grid;
    grid-column: 1/3;
    grid-template-columns: 1fr 1fr;
  }
  .subscription-card__edit-address {
    font-size: 14px;
  }
}

.subscriptions_title {
  text-align: left;
  font-size: 20px;
  margin-top: 2em;
  margin-left: 1.2em;
  margin-bottom: 0.8em;

  @media (min-width: $medium-screen) {
    grid-column: 1 / 3;
  }
}

.subscription-none {
  margin-left: 4em;
}

.subscription-card {
  align-self: flex-start;
  margin: 0 1.2em;
  margin-bottom: 3em;
  box-shadow: 0px 3px 6px #0000001a;
}

.subscriptions__no-sub {
  h3 {
    font-size: 20px;
    margin-left: 1.2em;
  }

  &--section {
    margin: 0 1.2em;
    padding: 1em 1.2em;
  }
}
</style>
