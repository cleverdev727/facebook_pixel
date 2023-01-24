import { hasSubscriptionId } from '../helpers/subscription'

export default {
  computed: {
    hasSubscriptionId() {
      return hasSubscriptionId(this.product)
    },
    isEligibleForMembership() {
      if (this.isRechargePage) {
        return false
      }
      if (
        this.product?.metadata?.upsellProduct?.handle === this.product.handle
      ) {
        return false
      }

      return !this.purchasedMembership
    },
    isMember() {
      return this.product?.metadata?.isMember
    },
    isMembershipProduct() {
      return this.product?.productType.toLowerCase() === 'membership'
    },
    isSubscriptionOnly() {
      const { product } = this
      if (product?.metadata?.isSubscriptionOnly) {
        return true
      }
      let { tags } = product
      tags = tags || []
      let isSubscriptionOnly = false
      tags.forEach((tag) => {
        if (
          ['subscriptiononly', 'subscription only', 'subscription'].includes(
            tag.toLowerCase()
          )
        ) {
          isSubscriptionOnly = true
        }
      })

      return isSubscriptionOnly
    },
    purchasedMembership() {
      return this.product?.metadata?.purchasedMembership
    }
  }
}
