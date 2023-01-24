<template>
  <client-only>
    <div class="customer-card">
      <div
        v-if="customer"
        class="customer-card_section customer-card_section-mobile"
      >
        <p class="customer-card_name">
          {{ customer.firstName }} {{ customer.lastName }}
        </p>
        <p>{{ customer.email }}</p>
        <customer-points v-if="showMembership" />
      </div>
      <div v-if="showMembership" class="customer-card_section">
        <p class="customer-card_membership">LOLA+ Membership</p>
        <div v-if="isMember">
          <p class="customer-card_desc">
            Free shipping, discounts, early access, and more. You’re an insider
            now.
            <nuxt-link to="/products/lola-memberships">See details</nuxt-link>
          </p>
          <p class="customer-card_month">$1.66/month</p>
          <div class="customer-card_box">
            <div class="customer-card_box-item">
              <p class="customer-card_box-title">Joined</p>
              <p class="customer-card_box-date">
                {{ membershipSub.created_at | date }}
              </p>
            </div>
            <div class="customer-card_box-item">
              <p v-if="membershipActive" class="customer-card_box-title">
                Renews on
              </p>
              <p v-else class="customer-card_box-title">Membership ends</p>
              <p class="customer-card_box-date">
                {{ membershipRenews | date }}
              </p>
            </div>
            <div
              v-if="membershipActive"
              class="customer-card_box-item customer-card_box-item-center"
            >
              <p class="customer-card_box-renews">Renews for $20/year</p>
              <p class="customer-card_box-cancel" @click="toggleCancel">
                Cancel renewal
              </p>
              <div v-if="showCancel" class="customer-card_box-cancel-reason">
                <p class="customer-card_box-cancel-title">
                  Cancellation reason
                </p>
                <input
                  id="cancel-membership-reason"
                  v-model="cancellationReason"
                  type="text"
                />
                <button
                  class="customer-card_box-cancel-button"
                  :disabled="isDisabled"
                  @click="cancelMembership(membershipSub.id)"
                >
                  Cancel renewal
                </button>
              </div>
            </div>
            <div
              v-else
              class="customer-card_box-item customer-card_box-item-center"
            >
              <p
                class="customer-card_box-cancel"
                @click="reactivateMembership(membershipSub.id)"
              >
                Enable renewal
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="customer-card_desc">
            Want free shipping, exclusive discounts, early access, and more? You
            can with LOLA+.
          </p>
          <p class="customer-card_month">$1.66/month</p>
          <div class="customer-card_box">
            <div class="customer-card_box-benefit">
              <span class="customer-card_box-icon"><icon-free-shipping /></span>
              <span>Free shipping</span>
            </div>
            <div class="customer-card_box-benefit">
              <span class="customer-card_box-icon"><icon-heart /></span>
              <span>Donations with every order</span>
            </div>
            <div class="customer-card_box-benefit">
              <span class="customer-card_box-icon"><icon-more /></span>
              <span>+ more!</span>
            </div>
            <nuxt-link class="button" to="/products/lola-memberships">
              Become a member
            </nuxt-link>
          </div>
        </div>
        <div v-if="isFormSubmitted" class="cart__loader">
          <div class="lds-dual-ring"></div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import datePriceFilters from '@/mixins/datePriceFilters.js'
import IconFreeShipping from '@/components/lola/icons/IconFreeShipping.vue'
import IconHeart from '@/components/lola/icons/IconHeart.vue'
import IconMore from '@/components/lola/icons/IconMore.vue'
import account from '@/mixins/account'

export default {
  components: {
    IconFreeShipping,
    IconHeart,
    IconMore
  },
  mixins: [datePriceFilters, account],
  props: {
    customer: {
      type: Object,
      default: () => {
        return {}
      }
    },
    membershipSub: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showCancel: false,
      cancellationReason: '',
      isFormSubmitted: false
    }
  },
  computed: {
    isMember() {
      return this.customer?.tags.includes('StoreMember')
    },
    membershipActive() {
      return this.membershipSub?.status === 'ACTIVE'
    },
    isDisabled() {
      return !this.cancellationReason
    },
    membershipRenews() {
      const { created_at: createdAt, next_charge_scheduled_at: nextCharge } =
        this.membershipSub
      if (nextCharge) {
        return nextCharge
      }
      const date = new Date(createdAt)
      return date.setMonth(date.getMonth() + 12)
    },
    showMembership() {
      return Object.keys(this.membershipSub).length > 0
    }
  },
  methods: {
    toggleCancel() {
      this.showCancel = !this.showCancel
    },
    cancelMembership(id) {
      if (confirm('Are you sure you want to cancel your membership?')) {
        this.isFormSubmitted = true
        const cancelReason = this.cancellationReason
        const data = {
          status: 'CANCELLED',
          cancellation_reason: 'membership',
          cancellation_reason_comments: cancelReason
        }
        this.editSubscription({ id, data }).then(
          () => (this.isFormSubmitted = false)
        )
      }
    },
    reactivateMembership(id) {
      if (confirm('Are you sure you want to reactivate your membership?')) {
        this.isFormSubmitted = true
        this.activateSubscription({ id }).then(
          () => (this.isFormSubmitted = false)
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-card {
  text-align: left;
  background-color: #f8f6f2;
  padding: 2em;

  @media (min-width: 960px) {
    grid-column: 1 / 3;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  &_name {
    font-size: 28px;
    text-align: left;
    margin-bottom: 1em;
  }
  &_section {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    font-size: 15px;

    @media (min-width: 960px) {
      justify-content: flex-start;
      margin-left: 2em;
      max-width: 24em;
    }
  }

  &_section-mobile {
    @media (max-width: 960px) {
      border-bottom: 1px solid #dcdcdc;
      margin-bottom: 1.5em;
    }
  }

  &_membership {
    font-size: 24px;
    margin-bottom: 0.6em;
  }

  &_desc {
    margin-bottom: 0;
  }

  &_month {
    font-size: 14px;
    color: #fff;
    background: #4e6282;
    position: relative;
    top: 2.1em;
    width: 7em;
    padding: 0 0.5em;
    border-radius: 3px;
  }

  &_box {
    box-shadow: 0px 3px 6px #0000001a;
    background: #fff;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    padding: 1em;
    padding-top: 2em;
    border-radius: 4px;

    @media (min-width: 960px) {
      padding: 2em;
      padding-bottom: 1em;
    }

    &-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    &-item-center {
      align-self: center;
    }

    &-cancel-reason {
      grid-column: 1/3;
      margin: auto;
    }

    &-cancel-title {
      text-transform: uppercase;
      margin-bottom: 0.5em;
    }

    &-title {
      font-size: 16px;
      color: #4e6282;
      font-weight: bold;
    }

    &-benefit {
      font-size: 16px;
      display: flex;
      align-items: center;
      margin-bottom: 1em;
    }

    &-icon {
      margin-right: 1em;
    }

    &-cancel {
      font-size: 12px;
      cursor: pointer;
      text-decoration: underline;
    }

    &-cancel-button {
      padding: 0 3em;
      border: 1px solid;
    }

    &-date {
      font-size: 16px;
    }

    &-renews {
      font-size: 12px;
      font-weight: bold;
      margin-right: 1em;

      @media (min-width: 960px) {
        margin-right: 2em;
      }
    }
  }
}
</style>
