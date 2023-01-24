import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('cart', ['lineItems']),

    cartContainsOnlyDigitalProduct() {
      if (this.lineItems.length !== 1) return false

      const item = this.lineItems[0]
      const type = item.productType?.toLowerCase()
      return ['donation', 'membership'].includes(type)
    }
  }
}
