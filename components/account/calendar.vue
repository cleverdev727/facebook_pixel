<template>
  <client-only>
    <span class="set-renewal-date">
      <div v-if="show" class="calendar-modal-backdrop" @click.self="showModal">
        <input v-model="date" style="display: none" required />
        <div class="renewal-date-picker">
          <p class="renewal-date-picker__cancel" @click.stop="showModal">
            &times;
          </p>
          <client-only>
            <v-date-picker
              v-model="date"
              :min-date="min_date"
              :max-date="max_date"
              is-inline
            />
          </client-only>
          <p class="renewal-date-picker__next">
            <span class="renewal-dot"></span>Your next renewal
          </p>
          <button
            v-if="isBulk"
            class="renewal-date-picker__cta"
            :disabled="isDisabled"
            @click="bulkSubscriptionUpdate(id, 'NEXT_CHARGE_DATE')"
          >
            Update
          </button>
          <button
            v-else
            class="renewal-date-picker__cta"
            :disabled="isDisabled"
            @click="setNextCharge(id, nextCharge, isOnetime)"
          >
            Update
          </button>
          <p class="renewal-date-picker__note" style="padding-bottom: 0">
            <strong>Select any date within 3 months.</strong>
          </p>
          <br />
          <p class="renewal-date-picker__note">
            Note: your order may take up to 10 business days to arrive. All
            weekend renewals will be processed by our warehouse on Mondays.
          </p>
          <div v-if="isBulk">
            <span
              v-show="!showForm"
              class="bulk-subscription__cancel"
              @click="toggleCancellationForm"
              >Cancel subscription</span
            >
            <form v-if="showForm" class="cancellation-flow__form">
              <div class="cancellation-flow__form__reason">
                <label :for="'cancellation_reason-' + id"
                  >Cancellation reason</label
                >
                <select v-model="cancellationReason">
                  <option value="">Select a reason for cancelling</option>
                  <option
                    v-for="(strategy, index) in retentionStrategies"
                    :key="index"
                    :value="strategy"
                  >
                    {{ strategy }}
                  </option>
                </select>
              </div>
              <br />
              <div class="cancellation-flow__form__comments">
                <label :for="'cancellation_reason_comments-' + id"
                  >Cancellation reason comments</label
                >
                <textarea v-model="cancellationComment"></textarea>
              </div>
              <button
                class="renewal-date-picker__cta cancellation-flow__form__button"
                :disabled="cancelDisabled"
                @click.prevent="bulkSubscriptionUpdate(id, 'CANCEL')"
              >
                Cancel subscription
              </button>
              <span
                class="bulk-subscription__cancel"
                @click="toggleCancellationForm"
                >Cancel</span
              >
            </form>
            <br />
          </div>
        </div>
      </div>
      <span
        v-else
        :class="isBulk ? 'button' : 'renewal-date-picker__change'"
        @click="showModal"
      >
        {{ isBulk ? 'Edit subscription' : 'change' }}
      </span>
      <div v-if="isFormSubmitted" class="cart__loader">
        <div class="lds-dual-ring"></div>
      </div>
    </span>
  </client-only>
</template>

<script>
import account from '@/mixins/account.js'

export default {
  mixins: [account],
  props: {
    nextCharge: {
      type: String,
      default: ''
    },
    now: {
      type: Date,
      default: () => {
        return new Date(Date.now())
      }
    },
    url: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: null
    },
    isBulk: {
      type: Boolean,
      default: false
    },
    isOnetime: {
      type: Boolean,
      default: false
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
      min_date: new Date(Date.now()),
      max_date: new Date(this.now.setMonth(this.now.getMonth() + 3)),
      date: this.nextCharge == null ? '' : new Date(this.nextCharge),
      show: false,
      isFormSubmitted: false,
      showForm: false,
      cancellationReason: '',
      cancellationComment: ''
    }
  },
  computed: {
    isDisabled() {
      if (this.date) {
        return this.date.getTime() === new Date(this.nextCharge).getTime()
      }
      return true
    },
    cancelDisabled() {
      return this.cancellationReason === ''
    }
  },
  watch: {
    nextCharge: {
      handler(date) {
        this.date = new Date(date)
      }
    }
  },
  methods: {
    showModal() {
      this.show = !this.show
    },
    toggleCancellationForm() {
      this.showForm = !this.showForm
      this.resetCancellationForm()
    },
    resetCancellationForm() {
      this.selectedReason = ''
      this.cancellationComment = ''
    }
  }
}
</script>

<style scoped lang="scss">
.set-renewal-date {
  cursor: pointer;
  &:hover {
    color: $action-color-alt;
  }
}

.calendar-modal-backdrop {
  z-index: 99999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.renewal-date-picker {
  display: flex;
  align-items: center;
  flex-flow: column;
  padding: 1em;
  max-width: 20em;
  background: #fff;

  @media (min-width: $medium-screen) {
    max-width: 27em;
  }

  &__next {
    font-size: 14px !important;

    .renewal-dot {
      height: 12px;
      width: 12px;
      background-color: $action-color-alt;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
  }

  &__cancel {
    align-self: flex-end;
    cursor: pointer;
    font-size: 30px !important;
    font-weight: bold;
    line-height: 0.5;
  }

  &__note {
    font-size: 12px !important;
    text-align: center;
    padding: 0 3em 1em 3em;
    margin-bottom: 0;
  }

  &__cta {
    border: 1px solid;
    border-radius: 24px;
    color: #514945;
    background: transparent;
    line-height: 40px;
    margin-top: 1.4em;
    margin-bottom: 2em;
    text-transform: none;
    letter-spacing: 0;
    padding: 0 4rem;
    font-size: 0.75rem;

    &:hover {
      background: #514945;
      color: #fff;
    }
  }

  &__change {
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: $action-color-alt;
    }
  }

  select,
  textarea {
    font-size: 12px;
  }
}

.bulk-subscription__cancel {
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 2em;
  display: block;
  text-align: center;
}

.button {
  margin-bottom: 16px;
}
</style>
