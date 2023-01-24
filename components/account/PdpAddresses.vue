<template>
  <client-only>
    <section>
      <div :class="isUpsellModal ? '' : 'add-to-subscription'">
        <span
          class="add-to-subscription__text"
          :class="isUpsellModal ? 'add-to-subscription__modal-text' : ''"
          >{{ editCopy }} shipping to</span
        >
        <select
          id="select_address_id"
          v-model="selectedAddress"
          name="address"
          class="add-to-subscription__select"
          :class="isUpsellModal ? 'add-to-subscription__modal-select' : ''"
        >
          <option
            v-for="address in activeAddresses"
            :key="address.id"
            :value="address.id"
          >
            {{ displayAddress(address) }}
          </option>
        </select>
        <input v-show="false" id="next_charge_date" :value="nextCharge" />
        <div v-if="!isUpsellModal" class="add-to-subscription__ctas">
          <nuxt-link
            :to="`/account/search/1?address=${selectedAddress}`"
            class="button add-to-subscription__cta"
          >
            Back to products
          </nuxt-link>
          <nuxt-link to="/account" class="button add-to-subscription__cta"
            >Back to subscription</nuxt-link
          >
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    isUpsellModal: {
      type: Boolean,
      default: false
    },
    initialSelectedAddress: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      selectedAddress: ''
    }
  },
  computed: {
    ...mapState('account', ['addresses', 'subscriptions', 'onetimes']),
    activeAddresses() {
      const addresses = this.subscriptions
        .filter((sub) => sub.sku !== 'LOLA Membership')
        .map((subscription) => subscription.address_id)
      const uniqueAddresses = [...new Set(addresses)]
      return this.addresses.filter((address) =>
        uniqueAddresses.includes(address.id)
      )
    },
    activeSubscriptions() {
      const subscriptions = this.subscriptions.filter(
        (sub) => sub.sku !== 'LOLA Membership'
      )
      return subscriptions.concat(this.onetimes)
    },
    nextCharge() {
      const subs = this.activeSubscriptions.filter(
        (sub) =>
          sub.address_id === this.selectedAddress && sub.status === 'ACTIVE'
      )
      const dates = subs
        .map((sub) => sub.next_charge_scheduled_at)
        .filter((date) => new Date(date) > new Date())
      dates.sort((a, b) => new Date(a) - new Date(b))
      return dates[0]
    },
    editCopy() {
      return this.isUpsellModal ? '' : `You're editing subscription`
    }
  },
  mounted() {
    this.selectedAddress =
      this.initialSelectedAddress || this.activeAddresses[0].id
  },
  methods: {
    displayAddress(adr) {
      return `${adr.address1} ${adr.address2} ${adr.city} ${adr.province} ${adr.zip}`
    }
  }
}
</script>

<style lang="scss" scoped>
.add-to-subscription {
  background: #f8f6f2;
  display: flex;
  flex-flow: column;
  align-items: center;
  text-align: center;
  padding-top: 2em;
  padding-bottom: 1em;
  margin-bottom: 3em;

  @media (min-width: 600px) {
    padding: 2em 0;
  }

  &__text {
    display: block;
    font: 100 16px/23px 'Apercu Medium', sans-serif;
    margin-bottom: 1.45em;

    &:first-letter {
      text-transform: uppercase;
    }
  }

  &__modal-text {
    margin-bottom: 5px;
    margin-top: 1em;
    transform: scale(0.9);
  }

  &__select {
    width: 90%;
    text-align-last: center;
    padding-right: 25px;
    font: 16px/15px 'Apercu Light', sans-serif;
    border: none;
    background: #fff
      url("data:image/svg+xml;utf8,<svg viewBox='0 0 140 140' width='16' height='24' xmlns='http://www.w3.org/2000/svg'><g><path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z' fill='black'/></g></svg>")
      no-repeat;
    background-position: right 6px top 50%;

    @media (min-width: 600px) {
      width: 50%;
    }
  }

  &__modal-select {
    width: 100%;
    text-align-last: left;
    margin-bottom: 0;
    border: 1px solid #dcdcdc;
    transform: scale(0.9);

    @media (min-width: 600px) {
      width: 100%;
    }
  }

  &__ctas {
    margin-top: 1em;

    @media (min-width: 600px) {
      display: flex;
      margin-top: 1em;
    }
  }

  &__cta {
    padding: 0 3em;
    margin: 1em 0;

    @media (min-width: 600px) {
      margin: 0 1em;
    }
  }
}
</style>
