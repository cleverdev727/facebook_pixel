import { mapActions, mapMutations } from 'vuex'
import { referenceHandle, getProduct, getImageSrc } from '~/helpers/product'

export default {
  data() {
    return {
      labels: [
        '_SKU:RTNOT',
        '_SKU:STNOT',
        '_SKU:PTNOT',
        '_SKU:LTPA',
        '_SKU:RTPOT',
        '_SKU:STPOT',
        '_SKU:PTPOT',
        '_SKU:RCPT',
        '_SKU:SCPT',
        '_SKU:RPOC',
        '_SKU:HPOC'
      ],
      retentionStrategies: [
        'I had an issue with the product',
        'I no longer want a subscription service ',
        'I have an irregular period',
        'I have too much product at home ',
        "I'm pregnant",
        'Other'
      ]
    }
  },
  methods: {
    ...mapMutations('account', ['setAccountNotification']),
    ...mapActions('account', [
      'editSubscription',
      'editOnetime',
      'activateSubscription',
      'editAddressSubscriptions',
      'removeOnetime',
      'addAddressDiscount',
      'removeAddressDiscount',
      'renewalDateTracking'
    ]),
    setErrorNotification(message) {
      const helpText =
        'If the problem persists please reach out to help@mylola.com.'
      const errorMessage = message ? `${message}. ${helpText}` : helpText
      this.setAccountNotification({
        type: 'error',
        message: errorMessage
      })
    },
    setSuccessNotification(message) {
      this.setAccountNotification({
        type: 'success',
        message
      })
    },
    getSkuString(properties) {
      const hasSku = properties.some((obj) => obj.name.includes('_SKU'))
      const absorbencies = []

      if (hasSku) {
        const props = []
        properties.map((prop) => (props[prop.name] = prop.value))
        for (let i = 0; i < this.labels.length; i++) {
          if (Object.keys(props).includes(this.labels[i])) {
            const name = this.labels[i].split(':')[1]
            const value = props[this.labels[i]]
            const absorbency = `${name}:${value}`
            absorbencies.push(absorbency)
          }
        }
        return absorbencies.join()
      }
    },
    formatMoney(value) {
      return value % 1 === 0 ? value : value.toFixed(2)
    },
    deleteOnetime(id) {
      this.isFormSubmitted = true
      this.removeOnetime({ id })
        .then(() => {
          this.isFormSubmitted = false
          this.setSuccessNotification('Delete successful')
        })
        .catch(() => {
          this.isFormSubmitted = false
          this.setErrorNotification('Cannot remove onetime')
        })
    },
    applyDiscount(id, discountCode) {
      this.isFormSubmitted = true
      const data = {
        discount_code: discountCode
      }
      this.addAddressDiscount({ id, data })
        .then(() => {
          this.isFormSubmitted = false
          this.setSuccessNotification('Discount added')
        })
        .catch(() => {
          this.isFormSubmitted = false
          this.setErrorNotification(
            `We're unable to add discount code ${data.discount_code}`
          )
        })
    },
    removeDiscount(id) {
      const data = {
        address_id: id
      }
      this.isFormSubmitted = true
      this.removeAddressDiscount({ data })
        .then(() => {
          this.isFormSubmitted = false
          this.setSuccessNotification('Discount removed')
        })
        .catch(() => {
          this.isFormSubmitted = false
          this.setErrorNotification(
            "We're unable to remove discount from address"
          )
        })
    },
    setNextCharge(id, nextCharge, isOnetime) {
      this.isFormSubmitted = true
      const offsetSeconds = this.date.getTimezoneOffset() * 60 * 1000
      const nextDate = new Date(this.date.getTime() - offsetSeconds)
        .toISOString()
        .slice(0, 10)
      const data = {
        id,
        data: {
          next_charge_scheduled_at: nextDate
        }
      }
      if (isOnetime) {
        this.editOnetime(data)
          .then(() => {
            this.isFormSubmitted = false
            this.show = false
            this.setSuccessNotification('Date updated')
          })
          .catch(() => {
            this.isFormSubmitted = false
            this.show = false
            this.setErrorNotification(
              "We're unable to update onetime's next charge date"
            )
          })
      } else {
        this.editSubscription(data)
          .then(() => {
            if (window.location.hostname === 'mylola.com') {
              this.renewalDateTracking({
                data: {
                  subscriptionId: id,
                  subscriptionNextChargeDate: nextCharge
                }
              })
            }
            this.isFormSubmitted = false
            this.show = false
            this.setSuccessNotification('Date updated')
          })
          .catch(() => {
            this.isFormSubmitted = false
            this.show = false
            this.setErrorNotification(
              "We're unable to update subscription's next charge date"
            )
          })
      }
    },
    // bulk update actions
    bulkSubscriptionUpdate(id, type) {
      this.isFormSubmitted = true
      // get address id
      const addressId = id
      // get Subscriptions
      const subs = this.subscriptions
      // create empty object to send
      let dataToSend = {
        subscriptions: []
      }

      if (type === 'REACTIVATE') {
        dataToSend = this.getReactivateData(subs, addressId)
      } else if (type === 'CANCEL') {
        dataToSend = this.getCancelData(subs, addressId)
      } else if (type === 'NEXT_CHARGE_DATE') {
        dataToSend = this.getNextChargeDateData(subs, addressId)
      }

      const updates = {
        id: addressId,
        data: dataToSend
      }

      // send POST request to update all subscriptions tied to the address
      this.editAddressSubscriptions(updates)
        .then(() => {
          this.isFormSubmitted = false
          this.show = false
          this.setSuccessNotification('Address updated')
        })
        .catch(() => {
          this.isFormSubmitted = false
          this.setErrorNotification("We're unable to bulk update subscriptions")
        })
    },

    getNextChargeDateData(subs, addressId) {
      const nextDate = new Date(this.date)
      const offsetSeconds = nextDate.getTimezoneOffset() * 60 * 1000
      const nextChargeDate = new Date(nextDate.getTime() - offsetSeconds)
        .toISOString()
        .slice(0, 10)

      const subsToUpdate = subs
        .filter(function (sub) {
          return sub.address_id === addressId && sub.status !== 'ONETIME'
        })
        .map(function (sub) {
          return {
            id: sub.id,
            next_charge_scheduled_at: nextChargeDate
          }
        })

      return {
        subscriptions: subsToUpdate
      }
    },

    getReactivateData(subs, addressId) {
      const subsToUpdate = subs
        .filter(function (sub) {
          return sub.address_id === addressId && sub.status === 'CANCELLED'
        })
        .map(function (sub) {
          return {
            id: sub.id,
            status: 'ACTIVE'
          }
        })
      return {
        subscriptions: subsToUpdate
      }
    },

    getCancelData(subs, addressId) {
      const cancellationReason = this.cancellationReason
      const cancellationReasonComment = this.cancellationComment
      const subsToUpdate = subs
        .filter(function (sub) {
          return sub.address_id === addressId && sub.status !== 'ONETIME'
        })
        .map(function (sub) {
          return {
            id: sub.id,
            status: 'CANCELLED',
            cancellation_reason: cancellationReason,
            cancellation_reason_comments: cancellationReasonComment
          }
        })
      return {
        subscriptions: subsToUpdate
      }
    },
    getImageSrc,
    getProduct,
    referenceHandle
  }
}
