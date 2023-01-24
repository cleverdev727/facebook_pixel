<template>
  <client-only>
    <section>
      <header>
        <span class="subscription-card__header">
          <span class="subscription-card__title" @click="toggleAddressPreview">
            Subscription {{ index + 1 }}
            <icon-chevron-down
              class="inline-icon--chevron"
              :class="{ 'subscription-item__chevron-up': showAddressPreview }"
            />
          </span>
          <span class="subscription-card__last-updated">
            Last edited: {{ lastUpdated | date('short') }}
          </span>
        </span>
        <div class="subscription-card__info">
          <div class="subscription-card__address">
            <span class="subscription-card__ship">Ship to</span>
            <span>
              <span class="subscription-card__address-details">
                {{ address.address1 }}
                {{ address.address2 }}
                {{ address.city }}
                {{ address.province }}
                {{ address.zip }}
              </span>
              <nuxt-link
                :to="`/account/address/${address.id}`"
                class="subscription-card__edit-address"
                >Edit</nuxt-link
              >
            </span>
          </div>
          <div class="subscription-card__discount">
            <div
              v-if="address.discount_id && address.discount.code"
              class="subscription-card__discount-section"
            >
              <label class="subscription-card__promo" for="discount_code"
                >Promo</label
              >
              <input
                type="text"
                class="referral-form__input referral-form__input-borderless"
                readonly
                :value="address.discount.code"
              />
              <button
                class="subscription-card__discount-remove"
                @click="removeDiscount(address.id)"
              >
                -
              </button>
              <label class="subscription-card__discount-code">
                <span class="subscription-card__discount">You saved</span>
                <span v-if="address.discount.discount_type === 'percentage'"
                  >{{ address.discount.value }}%</span
                >
                <span v-else>${{ address.discount.value }}</span>
              </label>
            </div>
            <div v-else class="subscription-card__discount-section">
              <label class="subscription-card__promo" for="discount_code"
                >Promo</label
              >
              <input
                v-model="newDiscountCode"
                type="text"
                class="referral-form__input"
              />
              <button
                class="subscription-card__button"
                :disabled="newDiscountCode === ''"
                @click="applyDiscount(address.id, newDiscountCode)"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </header>
      <ul v-if="showAddressPreview" class="subscription-card__product-list">
        <div class="subscription-card__edit-cta">
          <section v-if="addressActive">
            <calendar
              :id="address.id"
              :is-bulk="true"
              :subscriptions="subscriptions"
              :next-charge="nextCharge"
            />
            <skip-to-donate
              :id="address.id"
              :is-disabled="isBulkDonateDisabled()"
              :is-bulk="true"
              :subscriptions="subscriptions"
            />
          </section>
          <span
            v-else
            class="button"
            @click="bulkSubscriptionUpdate(address.id, 'REACTIVATE')"
            >Reactivate subscription</span
          >
        </div>

        <li
          v-for="subscription in subscriptions"
          :key="subscription.id"
          class="subscription-item"
          :class="'subscription-item-' + subscription.id"
        >
          <div
            v-if="subscription.sku !== 'SKIPTODONATE'"
            class="subscription-item__preview"
            @click="showSubscriptionDetails(subscription.id)"
          >
            <div class="subscription-item__preview-item">
              <nuxt-img
                :alt="subscription.product_title"
                class="subscription-item__icon fade"
                :src="getImageSrc(subscription, products)"
              />

              <div class="subscription-item__preview-details">
                <span class="subscription-item__preview-heading">
                  {{ subscription.product_title }}
                </span>
                <div class="subscription-item__preview-renews">
                  <span
                    v-if="
                      subscription.status === 'ACTIVE' ||
                      subscription.status === 'ONETIME'
                    "
                    class="subscription-item__next-charge"
                  >
                    <span v-if="isDonateDisabled(subscription.id)">
                      Order skipped
                      <time> {{ subscription.updated_at | date }}; </time>
                      will renew
                      <time>
                        {{ subscription.next_charge_scheduled_at | date }}
                      </time>
                    </span>
                    <span v-else>
                      {{
                        subscription.status === 'ONETIME'
                          ? 'Ships on'
                          : 'Renews on'
                      }}
                      <time>
                        {{ subscription.next_charge_scheduled_at | date }}
                      </time>
                    </span>
                  </span>
                  <span v-else>Inactive</span>
                </div>
                <div v-if="prepayEligible(subscription)">
                  <nuxt-link
                    class="subscription-item__prepay"
                    :to="getHandle(subscription)"
                    >prepay eligible</nuxt-link
                  >
                </div>
              </div>
              <chevron-right
                classz="inline-icon--chevron subscription-item__chevron"
              />
            </div>

            <p class="subscription-item__preview-deliver">
              {{ deliveryDetails(subscription) }}
            </p>
          </div>
          <div style="display: none" class="subscription-item__details">
            <span
              class="subscription-item__details-heading"
              @click="showSubscriptionDetails(subscription.id)"
            >
              <chevron-right
                classz="inline-icon--chevron subscription-item__chevron-left"
              />
              <span>{{ subscription.product_title }}</span>
            </span>
            <span class="subscription-item__details-image">
              <nuxt-img
                :alt="subscription.product_title"
                class="subscription-item__icon fade"
                :src="getImageSrc(subscription, products)"
              />
            </span>
            <span class="subscription-item__details-info">
              <div class="subscription-item__item-header">
                <span>Details</span>
              </div>
              <div class="subscription-item__absorbencies">
                <span
                  v-if="
                    subAbsorbencies(subscription).length < 1 &&
                    subscription.variant_title !== 'Default Title'
                  "
                  >{{ subscription.variant_title }}</span
                >
                <span
                  v-for="(property, ind) in subAbsorbencies(subscription)"
                  :key="ind"
                  class="subscription-item__absorbencies"
                >
                  <span
                    v-if="subscription.product_title.includes('Pads')"
                    class="subscription-item__absorbency-pads"
                    :class="`subscription-item__${property.name}-pads`"
                  >
                  </span>
                  <span
                    v-else
                    class="subscription-item__absorbency"
                    :class="`subscription-item__${property.name}`"
                  >
                  </span>
                  <strong>{{ property.value }}</strong
                  >&nbsp;{{ property.name }}
                </span>
              </div>
              <p class="subscription-item__details-deliver">
                {{ subRenew(subscription) }}
              </p>
            </span>
            <span class="subscription-item__quantity">
              <p class="subscription-item__item-header">Qty</p>
              <p class="subscription-item__quantity-value">
                {{ subscription.quantity }}
              </p>
            </span>
            <span class="subscription-item__renewal-date">
              <span
                v-if="subscription.status === 'ONETIME'"
                class="subscription-item__item-header"
                >Next order ships</span
              >
              <span v-else class="subscription-item__item-header"
                >Next order renewal</span
              >
              <span
                v-if="
                  subscription.status == 'ACTIVE' ||
                  subscription.status == 'ONETIME'
                "
                class="subscription-item__details-date"
                >{{ subscription.next_charge_scheduled_at | date }}</span
              >
              <span v-else class="renewal-inactive">Inactive</span>
              <calendar
                v-if="
                  subscription.status == 'ACTIVE' ||
                  subscription.status == 'ONETIME'
                "
                :id="subscription.id"
                :next-charge="subscription.next_charge_scheduled_at"
                :is-bulk="false"
                :is-onetime="subscription.status == 'ONETIME'"
                :subscriptions="subscriptions"
              />
            </span>
            <div
              v-if="subscription.status == 'ONETIME'"
              class="subscription-item__actions"
            >
              <span class="button" @click="removeOnetime(subscription.id)">
                Remove
              </span>
            </div>
            <div
              v-else-if="subscription.status == 'ACTIVE'"
              class="subscription-item__actions"
            >
              <nuxt-link
                class="button subscription-item__edit"
                :to="getHandle(subscription)"
                >Edit product</nuxt-link
              >
              <div class="subscription-item__pause-cancel">
                <button
                  class="renewal-date-picker__change pause button button--stripped-blue"
                  @click="togglePauseModal(subscription.id)"
                >
                  Cancel or Pause
                </button>
                <skip-to-donate
                  :id="subscription.id"
                  :is-disabled="isDonateDisabled(subscription.id)"
                  :subscriptions="subscriptions"
                />
              </div>
            </div>
            <div v-else class="subscription-item__actions">
              <button
                class="button subscription-item__reactivate"
                @click.prevent="activateSub(subscription.id)"
              >
                Re-activate
              </button>
            </div>
          </div>
        </li>
        <nuxt-link
          :to="`/account/search/1?address=${address.id}`"
          class="subscription-card__add-product"
        >
          <div class="subscription-card__add-container">
            <empty-container />
          </div>
          <div class="subscription-card__add-column">
            <span class="subscription-card__add-heading">Add products</span>
            <p class="subscription-card__add-desc">
              Add new products to your subscription
            </p>
          </div>
          <chevron-right
            class="inline-icon--chevron subscription-item__chevron"
          />
        </nuxt-link>
      </ul>
      <!-- Pause modal -->
      <div v-show="showPauseModal" class="modal__recharge-subscription">
        <div class="modal__content">
          <span class="close" @click="togglePauseModal(null)">&times;</span>
          <div>
            <h3>Pause your subscription</h3>
            <p v-if="!isPauseDisabled(subscriptionId, 28)">
              Too much product? Just need a break? Press pause on deliveries for
              up to 2 months. After that, your subscription will renew as usual.
            </p>
            <p v-else>Pause is disabled for this product.</p>
          </div>
          <form class="modal__section" method="post" @submit.prevent="pauseSub">
            <input v-model="subscriptionId" type="hidden" />
            <div class="modal__display">
              <input
                :id="`${subscriptionId}-pause1`"
                v-model="delay"
                type="radio"
                name="pause"
                value="28"
              />
              <label
                v-show="!isPauseDisabled(subscriptionId, 28)"
                class="modal__label"
                :for="`${subscriptionId}-pause1`"
                >1 month</label
              >
              <input
                :id="`${subscriptionId}-pause2`"
                v-model="delay"
                type="radio"
                name="pause"
                value="56"
              />
              <label
                v-show="!isPauseDisabled(subscriptionId, 56)"
                class="modal__label"
                :for="`${subscriptionId}-pause2`"
              >
                2 months
              </label>
              <button
                v-show="!isPauseDisabled(subscriptionId, 28)"
                type="submit"
              >
                Pause Subscription
              </button>
              <p class="cancel" @click="toggleCancelModal()">
                Cancel subscription
              </p>
            </div>
          </form>
        </div>
      </div>
      <!-- cancelModal -->
      <div v-show="showCancelModal" class="modal__recharge-subscription">
        <div class="modal__content">
          <span class="close" @click="toggleCancelModal()">&times;</span>
          <div>
            <h3>Cancel your subscription</h3>
          </div>
          <div class="modal__section">
            <div class="modal__display">
              <div>
                <label :for="'cancellation_reason'">Cancellation reason</label>
                <select v-model="cancelReason">
                  <option value="">Select a reason for cancelling</option>
                  <option
                    v-for="(strategy, index_) in retentionStrategies"
                    :key="index_"
                    :value="strategy"
                  >
                    {{ strategy }}
                  </option>
                </select>
              </div>
              <br />
              <div>
                <label :for="'cancellation_reason_comments'"
                  >Cancellation reason comments</label
                >
                <textarea v-model="cancelComment"></textarea>
              </div>
              <button
                :disabled="cancelReason === ''"
                @click="cancelSubscription"
              >
                Cancel subscription
              </button>
              <p class="cancel" @click="togglePauseModal(subscriptionId)">
                Pause subscription
              </p>
            </div>
          </div>
          <br />
        </div>
      </div>
      <div v-if="isFormSubmitted" class="cart__loader">
        <div class="lds-dual-ring"></div>
      </div>
    </section>
  </client-only>
</template>

<script>
/* eslint-disable camelcase */
import { mapActions } from 'vuex'
import { products } from '@/locales/en.default.json'
import datePriceFilters from '@/mixins/datePriceFilters'
import account from '@/mixins/account'
import IconChevronDown from '@/components/lola/icons/IconChevronDown'
import ChevronRight from '@/components/lola/icons/ChevronRight'
import EmptyContainer from '@/components/lola/EmptyContainer'

export default {
  components: {
    IconChevronDown,
    ChevronRight,
    EmptyContainer
  },
  mixins: [datePriceFilters, account],
  props: {
    address: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number,
      default: null
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
  data() {
    return {
      showAddressPreview: true,
      showPauseModal: false,
      showCancelModal: false,
      isFormSubmitted: false,
      newDiscountCode: '',
      cancelReason: '',
      cancelComment: '',
      subscriptionId: null,
      delay: null
    }
  },
  computed: {
    addressActive() {
      return this.subscriptions.some((sub) => sub.status === 'ACTIVE')
    },
    nextCharge() {
      const subs = this.subscriptions.filter((sub) => sub.status === 'ACTIVE')
      if (subs.length === 0) {
        return new Date().toISOString()
      }
      const filteredSubs = subs
        .filter((sub) => new Date(sub.next_charge_scheduled_at) > new Date())
        .sort(
          (prevSub, currSub) =>
            new Date(prevSub.next_charge_scheduled_at) -
            new Date(currSub.next_charge_scheduled_at)
        )
      if (filteredSubs.length > 0) {
        const firstSub = filteredSubs[0]
        return firstSub.next_charge_scheduled_at || new Date().toISOString()
      }
      return new Date().toISOString()
    },
    lastUpdated() {
      const lastUpdatedSub = [...this.subscriptions].sort(
        (currSub, nextSub) => {
          return new Date(nextSub.updated_at) - new Date(currSub.updated_at)
        }
      )[0]
      return lastUpdatedSub.updated_at
    }
  },
  methods: {
    ...mapActions('account', [
      'editSubscription',
      'activateSubscription',
      'removeOnetime',
      'renewalDateTracking'
    ]),
    ...mapActions('events', ['pauseSubscription']),
    togglePauseModal(id) {
      this.showCancelModal = false
      this.subscriptionId = id
      this.showPauseModal = !this.showPauseModal
    },
    toggleCancelModal() {
      this.showPauseModal = false
      this.cancelReason = ''
      this.cancelComment = ''
      this.showCancelModal = !this.showCancelModal
    },
    toggleAddressPreview() {
      this.showAddressPreview = !this.showAddressPreview
    },
    showSubscriptionDetails(id) {
      const sub = document.querySelector(`.subscription-item-${id}`)
      const preview = sub.querySelector('.subscription-item__preview')
      const details = sub.querySelector('.subscription-item__details')
      const showPreview = preview.style.display === 'none'

      if (showPreview) {
        preview.style.display = ''
        details.style.display = 'none'
      } else {
        preview.style.display = 'none'
        details.style.display = ''
      }
    },
    subAbsorbencies(sub) {
      const { variant_title: variantTitle, properties, sku } = sub
      const translations = products.skus
      const hasSku = properties.some((obj) => obj.name.includes('_SKU'))
      const absorbencies = []

      if (hasSku) {
        const props = []
        properties.map((prop) => (props[prop.name] = prop.value))
        for (let i = 0; i < this.labels.length; i++) {
          if (Object.keys(props).includes(this.labels[i])) {
            const name = translations[this.labels[i].split(':')[1]]
            const value = props[this.labels[i]]
            const absorbency = { name, value }
            absorbencies.push(absorbency)
          }
        }
        return absorbencies
      }

      if (variantTitle.split(' ')[0] === 'All') {
        const name = variantTitle.split('/')[0].replace('All', '').trim()
        const value = variantTitle.split(' ').pop()
        return [{ name, value }]
      }

      if (sku === 'RHP0606' || sku === 'PB0606') {
        const oldPads = ['Regular', 'Heavy']
        const newPads = ['Day', 'Night']
        const names = sku === 'PB0606' ? newPads : oldPads
        names.map((name) => (absorbencies[name] = 6))
        return absorbencies
      }
      return ''
    },
    getDeliveryInfo(sub) {
      const {
        order_interval_frequency: frequency,
        order_interval_unit: interval
      } = sub
      const deliveryInfo =
        interval === 'week'
          ? frequency === '4'
            ? 'month'
            : `${frequency / 4} months`
          : `${frequency} ${interval}s`
      return `every ${deliveryInfo}`
    },
    subRenew(sub) {
      const { price, quantity, order_interval_frequency: frequency } = sub
      const months = frequency
        ? `renews every ${this.getDeliveryInfo(sub)}`
        : 'ships once'
      const cost = this.formatMoney(price * quantity)
      return `This product ${months} for $${cost}`
    },
    deliveryDetails(sub) {
      const {
        quantity,
        price,
        order_interval_frequency: frequency,
        order_interval_unit: interval
      } = sub
      const containers =
        frequency !== '8' && interval === 'week'
          ? (frequency / 4) * quantity
          : quantity
      const boxes = containers > 1 ? 'boxes' : 'box'
      const intervalInfo = frequency ? this.getDeliveryInfo(sub) : 'once'
      const cost = this.formatMoney(price * quantity)
      return `${containers} ${boxes} delivered ${intervalInfo} for $${cost}`
    },
    getHandle(sub) {
      const { shopify_product_id: productId, id, properties = [] } = sub
      const product = this.getProduct(productId, properties, this.products)
      return product ? `/account/edit/${product.handle}?sub_id=${id}` : '#'
    },
    isPauseDisabled(id, delay) {
      if (id) {
        const { next_charge_scheduled_at: date } = this.subscriptions.find(
          (sub) => sub.id === id
        )
        const now = new Date()
        const maxNextCharge = new Date(now.setMonth(now.getMonth() + 3))
        const nextCharge = new Date(Date.parse(date))
        nextCharge.setDate(nextCharge.getDate() + delay)
        return nextCharge > maxNextCharge
      }
      return true
    },
    isDonateDisabled(subId) {
      if (subId) {
        const {
          next_charge_scheduled_at: date,
          charge_interval_frequency: interval
        } = this.subscriptions.find(({ id }) => id === subId)
        const chargeInterval = parseInt(interval) * 7
        const now = new Date()
        const minNextCharge = new Date(
          now.setDate(now.getDate() + chargeInterval)
        )
        const nextCharge = new Date(Date.parse(date))
        return nextCharge > minNextCharge
      }
      return true
    },
    isBulkDonateDisabled() {
      const activeSubs = this.subscriptions.filter(
        (sub) => sub.status === 'ACTIVE'
      )
      const sortedSubs = activeSubs.sort(
        (a, b) =>
          new Date(a.next_charge_scheduled_at) -
          new Date(b.next_charge_scheduled_at)
      )
      const nextRenewingSub = sortedSubs[0]
      return this.isDonateDisabled(nextRenewingSub.id)
    },
    prepayEligible(sub) {
      const { properties = [] } = sub
      if (properties) {
        const hasPrepay = properties.find(
          (prop) =>
            prop.name === 'prepay_subscription_type' && prop.value === 'payg'
        )
        return hasPrepay !== undefined
      }
    },
    cancelSubscription() {
      const { id, product_title: productTitle } = this.subscriptions.find(
        ({ id }) => id === this.subscriptionId
      )
      this.isFormSubmitted = true
      this.editSubscription({
        id,
        data: {
          status: 'CANCELLED',
          cancellation_reason: this.cancelReason,
          cancellation_reason_comments: this.cancelComment
        }
      }).then(() => {
        // Iterable
        window._iaq.push([
          'track',
          'cancelSubscription',
          {
            productTitle,
            cancellationReason: this.cancelReason
          }
        ])
        this.toggleCancelModal()
        this.isFormSubmitted = false
      })
    },
    activateSub(id) {
      this.isFormSubmitted = true
      this.activateSubscription({
        id
      }).then(() => (this.isFormSubmitted = false))
    },
    getNewChargeDate(delay) {
      const { next_charge_scheduled_at } = this.subscriptions.find(
        ({ id }) => id === this.subscriptionId
      )
      const nextCharge = next_charge_scheduled_at
        ? new Date(Date.parse(next_charge_scheduled_at))
        : new Date()
      nextCharge.setDate(nextCharge.getDate() + parseInt(delay))
      return nextCharge.toISOString().split('T')[0].concat('T00:00:00')
    },
    pauseSub() {
      this.isFormSubmitted = true
      const newChargeDate = this.getNewChargeDate(this.delay)
      const { next_charge_scheduled_at, product_title: productTitle } =
        this.subscriptions.find(({ id }) => id === this.subscriptionId)
      this.editSubscription({
        id: this.subscriptionId,
        data: {
          next_charge_scheduled_at: newChargeDate
        }
      }).then(() => {
        // GA
        this.pauseSubscription()

        // Iterable
        window._iaq.push([
          'track',
          'pauseSubscription',
          {
            productTitle,
            subscriptionNextChargeDate: next_charge_scheduled_at
          }
        ])
        if (window.location.hostname === 'mylola.com') {
          this.renewalDateTracking({
            data: {
              subscriptionId: this.subscriptionId,
              subscriptionNextChargeDate: next_charge_scheduled_at
            }
          })
        }
        this.isFormSubmitted = false
        this.delay = null
        this.subscriptionId = null
        this.togglePauseModal(null)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.subscription-card {
  &__header {
    padding-right: 1.7em;
  }
  &__title {
    display: flex;
    justify-content: space-between;
    padding: 0.7em;
    padding-right: 1.7em;
    font-size: 14px;
    text-transform: uppercase;
    background: #4e6282;
    height: 42px;
    font-weight: bold;
    color: #fff;
    border-radius: 0.5em 0.5em 0 0;
    letter-spacing: 0.7px;
  }
  &__last-updated {
    display: inline-block;
    padding: 0 0.7em;
    padding-top: 1em;
    font-size: 14px;
  }
  &__info {
    padding: 0 0.7em;
    padding-bottom: 2em;
  }
  &__address {
    display: flex;
    padding: 1em 0;
  }
  &__ship,
  &__promo {
    text-transform: uppercase;
    font-size: 14px;
    color: #4e6282;
    font-weight: bold;
    letter-spacing: 0.7px;
    line-height: inherit;
    margin-bottom: -2px;
    padding-right: 1em;
  }
  &__ship {
    padding-right: 3em;
  }
  &__address-details {
    display: block;
    width: 12em;
    font-size: 14px;
  }
  &__edit-address {
    font-size: 12px;
  }
  &__discount-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__discount-code {
    background: #4e6282;
    color: #fff;
    font-size: 12px;
    text-transform: none;
    padding: 2px 1em;
    border-radius: 2px;
    margin: auto 0;
    white-space: nowrap;
  }
  &__discount-remove {
    background: transparent;
    color: #4e6282;
    border: 1px solid;
    height: 17px;
    padding: 4px;
    margin-right: 0.7em;
  }
  &__button {
    border-radius: 2px;
    font-size: 12px;
    height: 20px;

    &:disabled {
      opacity: 0.9 !important;
    }
  }

  &__add-product {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5em 1.7em 1.5em 0.7em;
    text-decoration: none;

    .subscription-item__chevron {
      display: block;
    }

    &:hover {
      color: inherit;
    }
  }

  &__add-container {
    width: 5rem;
    height: 5rem;
    margin-right: 1rem;
    border: 1px dashed #dcdcdc;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__add-column {
    margin-right: auto;
  }

  &__add-heading {
    font-size: 16px;
    line-height: 22px;
    color: #4e6282;
  }

  &__add-desc {
    font-style: normal;
    font-size: 13px;
    line-height: 22px;
  }

  &__edit-cta {
    background: #f8f6f2;
    padding: 2em;
    margin-bottom: 1em;
  }
}
.subscription-item {
  padding: 0 0.7em;
  padding-top: 1em;

  &:first-child {
    padding-top: 0;
  }

  &--canceled {
    span,
    p {
      opacity: 0.5;
    }
  }
}

.subscription-item__preview {
  border-bottom: 1px solid #dcdcdc;

  .subscription-item__preview-item {
    display: flex;
    padding-right: 1em;
    justify-content: space-between;
  }
  .subscription-item__icon {
    height: 5rem;
    width: 5rem;
    margin-right: 1rem;
  }
  .subscription-item__preview-details {
    padding-right: 0.5em;
    margin-right: auto;
  }
  .subscription-item__heading {
    display: block;
    font-size: 15px;
  }
  .subscription-item__preview-renews {
    font-size: 14px;
    color: #4e6282;
  }
  .subscription-item__prepay {
    display: block;
    background: $dark-blue;
    padding: 1px 1em;
    border: 1px solid;
    border-radius: 3px;
    margin-top: 1em;
    width: 9em;
    color: #fff;
    font-size: 12px;
    text-decoration: none;

    &:hover {
      background: transparent;
      color: #4e6282;
    }
  }
  .subscription-item__preview-deliver {
    font-size: 13px;
    padding-top: 1em;
    margin-left: 6rem;
    padding-right: 2em;
    text-align: left;
  }
  .subscription-item__details-deliver {
    font-size: 12px;
  }
  .subscription-item__renewal-date {
    display: flex;
    justify-content: space-between;
  }
  .set-renewal-date {
    text-decoration: underline;
  }
}

.subscription-item__details {
  border-bottom: 1px solid #dcdcdc;

  .subscription-item__details-heading {
    font-weight: bold;
    font-size: 15px;
    display: flex;
    text-align: center;
    align-items: center;

    span {
      display: block;
      font-size: 15px;
      padding-left: 1em;
      width: 90%;
    }
  }
  .subscription-item__details-image {
    display: block;
    padding: 1em 0;
    text-align: center;
  }
  .subscription-item__item-header {
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #4e6282;
  }
  .subscription-item__quantity {
    display: flex;
  }
  .subscription-item__quantity-value {
    padding-left: 1em;
    font-size: 14px;
  }
  .subscription-item__renewal-date {
    display: flex;
    justify-content: space-between;
  }
  .subscription-item__details-date {
    font-size: 14px;
    color: #4e6282;
  }
  .set-renewal-date {
    text-decoration: underline;
    font-size: 14px;
    padding-right: 1em;
  }
  .renewal-inactive {
    display: block;
    padding-right: 4em;
  }
}

.subscription-item__chevron {
  align-self: center;

  &-left,
  &-up {
    transform: rotate(180deg);
  }
}

.subscription-item__actions {
  margin: 2em 0;

  .subscription-item__edit {
    margin-top: 10px;
  }
  .subscription-item__pause-cancel {
    display: flex;
    justify-content: space-between;
    padding-top: 2em;

    .button {
      color: #514945;

      @media (min-width: $medium-screen) {
        padding: 0 2.8em;
      }

      &:hover {
        color: #fff;
      }
    }
  }
  .subscription-item__reactivate {
    margin-bottom: 2em;
    margin-top: 10px;
    width: 100%;
    font-weight: bold;
  }
}

.subscription-item__absorbencies {
  display: flex;
  align-items: center;
  margin-right: 0.5em;
  font-size: 14px;
  padding: 3px 0;

  @media (min-width: $medium-screen) {
    margin-right: 0.8em;
  }
}

.subscription-item__absorbency {
  display: inline-block;
  height: 16px;
  width: 16px;
  margin-right: 5px;
  border-radius: 50%;

  &-pads {
    height: 9px;
    width: 20px;
    margin-top: 2px;
    margin-right: 5px;
    border-radius: 20px;
  }
}

.subscription-item {
  &__Light {
    background: #d2dfea;
  }
  &__Regular {
    background: #9db9d6;
  }
  &__Super {
    background: #6e8db1;
  }
  &__Super\+ {
    background: #4e6282;
  }
  &__Regular-pads {
    background: #abc9cc;
  }
  &__Heavy-pads {
    background: #759ba4;
  }
}

.referral-form__input,
.referral-form__input:focus,
.referral-form__input:active,
.referral-form__input:hover {
  border-color: $dark-brown;
  box-shadow: none;
  color: #6e8db1;
  border: none;
  border-bottom: 1px solid #b8b8b8;
  font-size: 14px;
  background: inherit;
  margin-right: 2em;
}

.referral-form__input-borderless {
  border: none;
  font-weight: normal;
  margin: 0 auto;

  &:hover,
  &:focus,
  &:active {
    border-bottom: none;
    margin-right: inherit;
  }
}

.modal__recharge-subscription {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  .modal__content {
    background-color: #ffffff;
    margin: 30% auto;
    border: 1px solid $dark-gray;
    width: 90%;
    @media (min-width: $medium-screen) {
      width: 40%;
      margin: 10% auto;
      padding: 20px;
    }
    .close {
      color: $dark-brown;
      text-decoration: none;
      float: right;
      font-size: 30px;
      padding-right: 10px;
      font-weight: bold;
      &:hover,
      &:focus {
        cursor: pointer;
        color: $darker-brown;
        text-decoration: none;
      }
    }
    .cancel {
      color: #ed3b00;
      cursor: pointer;
    }
    div {
      text-align: center;
      clear: right;
      h3 {
        font-size: $large-font-size;
        margin: 0;
      }
      p {
        margin: 1rem 3rem;
      }
    }
    .modal__section {
      padding: 20px;
      @media (min-width: $medium-screen) {
        margin: 0 3rem;
      }
      .modal__display {
        display: flex;
        flex-direction: column;
        input[type='radio'] {
          display: none;
          &:checked + label {
            background-color: $dark-blue;
            border-color: $dark-blue;
            color: #ffffff;
          }
        }
        .modal__label {
          text-transform: none;
          border: 1px solid #dcdcdc;
          border-radius: 2px;
          text-align: center;
          line-height: 48px;
          letter-spacing: normal;
          cursor: pointer;
          color: $dark-brown;
          font-size: 0.85rem;
          font-weight: 400;
          &:hover,
          &:focus,
          &:active {
            background-color: $dark-blue;
            border-color: $dark-blue;
            color: #ffffff;
          }
        }
        button {
          background-color: #ffffff;
          border: 1px solid #dcdcdc;
          border-radius: 24px;
          color: $dark-brown;
          line-height: 40px;
          letter-spacing: normal;
          margin-top: 2rem;
          &:hover,
          &:focus {
            background-color: $dark-brown;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
