<template>
  <client-only>
    <span>
      <button
        v-tooltip.bottom="{
          content:
            'LOLA customers are now able to donate their upcoming subscription to our (rotating) donation partner! Click to know more.',
          offset: '6px'
        }"
        class="button button--stripped-blue"
        :disabled="isDisabled"
        :class="isBulk ? '' : 'button-subscription'"
        @click="showSkipPopup = true"
      >
        Skip to donate
      </button>
      <popup
        :show="showSkipPopup"
        @close-popup="showSkipPopup = false"
        @modal-clicked="showSkipPopup = false"
      >
        <div class="skip-content text--blue">
          <strong class="text--blue mb-1 d-block"
            >What is Skip to Donate?</strong
          >
          <p>
            You asked, we listened! LOLA customers are now able to skip their
            upcoming subscription order and instead donate the proceeds to our
            (rotating) donation partner! You’ll be charged the normal amount for
            your subscription (minus tax + shipping) and your subscription total
            will be donated directly to our donation partner for that renewal
            period. A perfect solution for customers who are stocked up on
            products, will be traveling during their subscription renewal, or
            are simply looking to contribute to our period equity mission.
          </p>
          <p>
            <strong>Please Note:</strong> Skip to Donate is irreversible,
            non-refundable, and not considered tax-deductible contributions. If
            you need your product sooner than the next renewal, please change
            your subscription renewal date or place a one-time order.
          </p>
          <button
            v-if="isBulk"
            :disabled="noDonationVariantId"
            class="button mx-auto mb-3"
            @click="bulkSkipToDonate"
          >
            Proceed to donate
          </button>
          <button
            v-else
            :disabled="noDonationVariantId"
            class="button mx-auto mb-3"
            @click="skipToDonate"
          >
            Proceed to donate
          </button>
        </div>
      </popup>
      <popup
        :show="showThankYouPopup"
        @close-popup="showThankYouPopup = false"
        @modal-clicked="showThankYouPopup = false"
      >
        <div class="skip-content text--blue thank-you">
          <nuxt-img
            src="https://images.ctfassets.net/acnkdcy3dwsy/70DyvSz6fzGPc8vYCOnm1Z/7bfccf58d51d12b8de2ae1c2c15db60a/Logo-color-1_1__1_.png"
            alt="LOLA - Support the girls"
            class="mx-auto mb-4"
          />
          <strong class="mb-1 d-block">Thank you for your generosity!</strong>
          <p>
            Your kindness will go a long way towards helping women in need. We
            partner with 501(c)(3) non-profit I Support the Girls to supply LOLA
            to women in need. We've donated over 6 million period products to
            date.
          </p>
          <button
            class="button mx-auto mb-3"
            @click="showThankYouPopup = false"
          >
            Close
          </button>
        </div>
      </popup>
      <div v-if="isFormSubmitted" class="cart__loader">
        <div class="lds-dual-ring"></div>
      </div>
    </span>
  </client-only>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import account from '@/mixins/account'

export default {
  mixins: [account],
  props: {
    isBulk: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    subscriptions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      showSkipPopup: false,
      showThankYouPopup: false,
      isFormSubmitted: false,
      donationProduct: {
        next_charge_scheduled_at: new Date(),
        sku: 'SKIPTODONATE',
        quantity: 1,
        shopify_variant_id: this.$config.donationVariantId
      }
    }
  },
  computed: {
    totalPrice() {
      return this.subscriptions
        .filter((sub) => sub.status === 'ACTIVE')
        .map(({ price, quantity }) => price * quantity)
        .reduce((a, b) => a + b, 0)
    },
    noDonationVariantId() {
      return !this.donationProduct.shopify_variant_id
    }
  },
  methods: {
    ...mapMutations('account', ['setAccountNotification']),
    ...mapActions('account', [
      'createOnetime',
      'editSubscription',
      'editAddressSubscriptions'
    ]),
    async skipToDonate() {
      this.isFormSubmitted = true
      const { id: subId } = this
      const subscription = this.subscriptions.find(({ id }) => id === subId)
      try {
        const {
          charge_interval_frequency: chargeInterval,
          address_id: addressId,
          price,
          quantity
        } = subscription
        const delay = parseInt(chargeInterval) * 7
        const newChargeDate = this.getNewChargeDate(delay, subId)
        const donation = { ...this.donationProduct, price: price * quantity }
        const updates = {
          id: subId,
          data: {
            next_charge_scheduled_at: newChargeDate
          }
        }
        await this.editSubscription(updates)
        await this.createOnetime({ addressId, data: donation })
      } catch {
        this.isFormSubmitted = false
        this.setAccountNotification({
          type: 'error',
          message: "Couldn't skip to donate"
        })
        this.showSkipPopup = false
      } finally {
        const { product_title: productTitle } = subscription
        window._iaq.push([
          'track',
          'skipToDonateSubscription',
          {
            productTitle
          }
        ])
        this.isFormSubmitted = false
        this.showSkipPopup = false
        this.showThankYouPopup = true
      }
    },
    async bulkSkipToDonate() {
      this.isFormSubmitted = true
      const { id: addressId } = this
      try {
        const nextRenewingSub = this.nextRenewingSub()
        const { id: subId, charge_interval_frequency: chargeInterval } =
          nextRenewingSub
        const delay = parseInt(chargeInterval) * 7
        const newChargeDate = this.getNewChargeDate(delay, subId)
        const donation = { ...this.donationProduct, price: this.totalPrice }
        const subsToUpdate = this.subscriptions
          .filter((sub) => sub.status === 'ACTIVE')
          .map(({ id }) => {
            return { id, next_charge_scheduled_at: newChargeDate }
          })
        const updates = {
          id: addressId,
          data: { subscriptions: subsToUpdate }
        }
        await this.editAddressSubscriptions(updates)
        await this.createOnetime({ addressId, data: donation })
      } catch {
        this.isFormSubmitted = false
        this.setAccountNotification({
          type: 'error',
          message: "Couldn't skip to donate for address"
        })
        this.showSkipPopup = false
      } finally {
        window._iaq.push([
          'track',
          'skipToDonateAddress',
          {
            addressId
          }
        ])
        this.isFormSubmitted = false
        this.showSkipPopup = false
        this.showThankYouPopup = true
      }
    },
    getNewChargeDate(delay, subId) {
      const { next_charge_scheduled_at: next } = this.subscriptions.find(
        ({ id }) => id === subId
      )
      const nextCharge = next ? new Date(Date.parse(next)) : new Date()
      nextCharge.setDate(nextCharge.getDate() + parseInt(delay))
      return nextCharge.toISOString().split('T')[0].concat('T00:00:00')
    },
    nextRenewingSub() {
      const activeSubs = this.subscriptions.filter(
        (sub) => sub.status === 'ACTIVE'
      )
      const sortedSubs = activeSubs.sort(
        (a, b) =>
          new Date(a.next_charge_scheduled_at) -
          new Date(b.next_charge_scheduled_at)
      )
      return sortedSubs[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  margin: auto;
  width: 100%;

  @media (min-width: $medium-screen) {
    padding: 0 2.8em;
  }

  &-subscription {
    color: #514945;
  }
}

.skip-content {
  text-align: center;
  width: calc(100vw - 30px);
  max-width: 380px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.thank-you {
  img {
    max-width: 160px;
  }

  padding-left: 32px;
  padding-right: 32px;
}
</style>
