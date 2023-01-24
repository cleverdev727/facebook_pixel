<template>
  <div class="add-to-cart-btn">
    <button
      class="gtm-pdp-add-to-cart add-to-cart Rise-add-to-cart-button"
      :disabled="isOutOfStock || disabled"
      type="button"
      @click.prevent="addToCart"
    >
      <slot>
        <span>{{ buttonText }}</span>
      </slot>
    </button>
    <div v-if="isFormSubmitted" class="cart__loader">
      <div class="lds-dual-ring"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { mapState, mapActions, mapMutations } from 'vuex'
import subscriptions from '@/mixins/subscriptions'
import { getShopifyVariantId, isOutOfStock } from '@/helpers/product'

export default {
  mixins: [subscriptions],
  props: {
    cartIsFull: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    form: {
      type: String,
      default: 'product-page'
    },
    upsellProduct: {
      type: Object,
      default: null
    },
    product: {
      type: Object,
      default: () => ({})
    },
    prepaidProduct: {
      type: Object,
      default: null
    },
    metafields: {
      type: Array,
      default: () => []
    },
    quantity: {
      type: Number,
      default: 1
    },
    useUpsellProductForm: {
      type: Boolean,
      default: true
    },
    variant: {
      type: Object,
      default: () => ({})
    },
    isSubscription: {
      type: Boolean,
      default: true
    },
    isRechargeEdit: {
      type: Boolean,
      default: false
    },
    isRechargeAdd: {
      type: Boolean,
      default: false
    },
    currentVariant: {
      type: String,
      default: null
    },
    frequency: {
      type: String,
      default: null
    },
    subscription: {
      type: Object,
      default: () => {
        return {}
      }
    },
    subscriptionType: {
      type: String,
      default: 'payg'
    }
  },
  data() {
    return { productState: 'initial', isFormSubmitted: false }
  },

  computed: {
    ...mapState('cart', ['lineItems']),
    isOutOfStock() {
      return isOutOfStock(this.variant || this.product, this.product.tags)
    },
    isPrepaidProduct() {
      return (this.product?.metadata?.prepaidProducts || []).length > 0
    },
    isPreorder() {
      return (
        this.product.metadata.isPreorder ||
        this.variant?.sku?.toLowerCase().includes('preorder')
      )
    },
    buttonText() {
      if (this.productState === 'added') {
        return 'Added!'
      }
      if (this.isOutOfStock) {
        return 'Out of stock'
      }
      if (this.isPreorder) {
        return 'Pre-order now'
      }
      if (this.isRechargeEdit) {
        return 'Update subscription'
      }
      if (this.isRechargeAdd) {
        return !this.hasSubscriptionId ? 'Add one-time' : 'Add to subscription'
      }
      return 'Add to cart'
    }
  },

  watch: {
    confirmedSelection() {
      this.addToCart()
    }
  },

  methods: {
    ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem'
    ]),
    ...mapActions('account', [
      'editSubscription',
      'createOnetime',
      'createSubscription'
    ]),
    ...mapMutations('cart', ['showCart']),
    ...mapMutations('global', ['showCartNotification']),
    ...mapMutations('account', ['setAccountNotification']),
    updateProductState() {
      this.productState = 'added'
      setTimeout(() => {
        this.productState = 'initial'
      }, 2000)
    },
    async addToCart() {
      const formSelector =
        this.form === 'quick-view' ? 'form.quick-view' : 'form.product-form'
      if (this.isRechargeEdit || this.isRechargeAdd) {
        this.isFormSubmitted = true
        const subId = parseInt(this.$route.query.sub_id)
        const form = document.querySelector(formSelector)
        const data = this.getCartData(form)
        // reshape properties to array
        const { properties: props_ } = data
        if (props_) {
          const props = Object.keys(props_).map((key) => {
            const out = { name: key, value: props_[key] }
            return out
          })
          data.properties = props
        }
        const {
          address_id,
          charge_interval_frequency,
          next_charge_scheduled_at,
          order_interval_frequency,
          order_interval_unit,
          price,
          properties,
          quantity,
          shopify_variant_id,
          sku
        } = data
        const subscription = {
          charge_interval_frequency,
          next_charge_scheduled_at,
          order_interval_frequency,
          order_interval_unit,
          properties,
          quantity,
          shopify_variant_id
        }
        if (this.isRechargeEdit) {
          subscription.price = price
          try {
            await this.editSubscription({ id: subId, data: subscription })
            this.setSuccessNotification('Subscription updated')
          } catch (err) {
            console.error(err)
            this.setErrorNotification("We're unable to update subscription")
          }
        } else if (
          !this.hasSubscriptionId ||
          this.subscriptionType === 'onetime'
        ) {
          const onetime = {
            next_charge_scheduled_at,
            properties,
            quantity,
            shopify_variant_id,
            sku
          }
          try {
            await this.createOnetime({ addressId: address_id, data: onetime })
            this.setSuccessNotification('Onetime added to address')
          } catch (err) {
            console.error(err)
            this.setErrorNotification("We're unable to add onetime to address")
          }
        } else {
          subscription.address_id = address_id
          subscription.sku = sku
          try {
            await this.createSubscription({ data: subscription })
            this.setSuccessNotification('Subscription added to address')
          } catch (err) {
            console.error(err)
            this.setErrorNotification(
              "We're unable to add subscription to address"
            )
          }
        }
        this.isFormSubmitted = false
        this.$emit('item-added')
        this.$router.push({ path: '/account' })
        return
      }
      this.updateProductState()
      const form = document.querySelector(formSelector)
      let metafields
      if (form) {
        metafields = this.getCartData(form).metafields
      }
      const product = this.prepaidProduct || this.product

      if (this.variant?.availableForSale) {
        const lineItem = {
          image: this.product.featuredMedia,
          title: this.product.title,
          variant: this.variant,
          quantity: this.quantity || 1,
          productId: product.id,
          handle: product.handle,
          vendor: this.product.vendor,
          tags: this.product.tags,
          productType: this.product.productType,
          metafields,
          metadata: this.product.metadata
        }

        this.addLineItem(lineItem)

        // Iterable
        const campaignId = parseInt(
          this.getCookie('iterableEmailCampaignId'),
          10
        )

        const itreablePrice =
          this.product.metadata.oneTimePrice ||
          this.product.metadata.subscriptionPrice

        const iterableItems = this.lineItems.map((lineItem) => ({
          id: lineItem.productId,
          name: lineItem.title,
          price: itreablePrice / 100 || null,
          quantity: lineItem.quantity,
          imageUrl: lineItem?.image?.src || null,
          dataFields: { metafields: lineItem.metafields }
        }))
        window._iaq.push(['updateCart', iterableItems])

        const productTypes = this.lineItems
          .map((lineItem) => lineItem.metafields)
          .flat()
          .filter((item) => item.key === 'product_type')
          .map((item) => item.value)

        if (
          productTypes.includes('subscription') &&
          productTypes.includes('otp')
        ) {
          // Iterable - Mixed cart
          const products = this.lineItems.map((lineItem) => ({
            title: lineItem.title,
            quantity: lineItem.quantity,
            image: lineItem.featuredMedia,
            handle: lineItem.handle,
            type: lineItem.metafields.find(
              (item) => item.key === 'product_type'
            ).value
          }))
          window._iaq.push(['track', 'mixedCart', { products }, campaignId])
        }

        // Add upsell product if the checkbox is ticked
        const mForm = document.querySelector('.upsell-product-form')
        if (this.form === 'product-page' && mForm) {
          const { metafields } = this.getCartData(mForm)
          const upsellItem = {
            image: this.upsellProduct.featuredMedia,
            title: this.upsellProduct.title,
            variant: this.upsellProduct.variants[0],
            quantity: 1,
            productId: this.upsellProduct.id,
            handle: this.upsellProduct.handle,
            vendor: this.upsellProduct.vendor,
            tags: this.upsellProduct.tags,
            productType: this.upsellProduct.productType,
            metafields,
            metadata: this.upsellProduct.metadata
          }
          this.addLineItem(upsellItem)
        }

        if (this.form !== 'product-page') {
          this.showCartNotification(lineItem.title)
          this.$emit('item-added')
        } else this.showCart()
      }
    },
    getProductData(form) {
      const formData = new FormData(form)
      const formObject = {}

      formData.forEach((value, key) => {
        const matched = key.match(/([^[]+)\[([^\]]+)]/)

        if (matched) {
          const parentKey = matched[1]
          const childKey = matched[2]

          formObject[parentKey] = formObject[parentKey] || {}
          formObject[parentKey][childKey] = value
        } else {
          formObject[key] = value
        }
      })

      return formObject
    },
    getCartData(form) {
      const productData = this.getProductData(form)

      if (this.isRechargeEdit || this.isRechargeAdd) {
        // reverse variant id if onetime or prepaid
        if (!this.hasSubscriptionId || this.isPrepaidProduct) {
          const variantToDuplicate = this.product.metadata.variantToDuplicate
          const reverseID = Object.keys(variantToDuplicate).find(
            // eslint-disable-next-line eqeqeq
            (key) => variantToDuplicate[key] == productData.id
          )
          if (reverseID) {
            productData.id = reverseID
            productData.shopify_variant_id = reverseID
          }
        }
        // add properties and shopify_variant_id
        const { shopify_variant_id, ...sanitizedData } = productData
        if ((sanitizedData.properties || []).shipping_interval_unit_type) {
          sanitizedData.order_interval_unit =
            sanitizedData.properties.shipping_interval_unit_type
          sanitizedData.order_interval_frequency =
            sanitizedData.properties.shipping_interval_frequency
          sanitizedData.charge_interval_frequency =
            sanitizedData.properties.shipping_interval_frequency
        }
        sanitizedData.shopify_variant_id = this.isPrepaidProduct
          ? shopify_variant_id
          : getShopifyVariantId(this.product?.variants[0]?.id)

        // edit subscription
        if (this.isRechargeEdit) {
          const { next_charge_scheduled_at: nextCharge = '' } =
            this.subscription
          sanitizedData.next_charge_scheduled_at = nextCharge
          sanitizedData.price =
            this.subscriptionType === 'payg'
              ? this.product.metadata.subscriptionPrice / 100
              : this.variant?.price
          return sanitizedData
        }

        // add onetime or subscription to an address
        const date = new Date()
        date.setDate(date.getDate() + 1)
        const tomorrow = date.toISOString().split('T')[0].concat('T00:00:00')
        sanitizedData.sku = this.variant?.sku
        const addressField = document.getElementById('select_address_id')
        const nextChargeField = document.getElementById('next_charge_date')
        sanitizedData.address_id = addressField ? addressField.value : ''
        sanitizedData.next_charge_scheduled_at = nextChargeField.value
          ? nextChargeField.value
          : tomorrow

        let dataToSend = sanitizedData
        if (!this.hasSubscriptionId) {
          const {
            shopify_variant_id,
            address_id,
            quantity,
            next_charge_scheduled_at,
            sku,
            properties = []
          } = sanitizedData
          dataToSend = {
            shopify_variant_id,
            address_id,
            quantity,
            next_charge_scheduled_at,
            sku,
            properties
          }
        }
        return dataToSend
      }

      // Build metafields
      let metafields = []
      const { properties } = productData

      if (properties?.subscription_id) {
        const { shipping_interval_unit_type } = properties
        let unitType = shipping_interval_unit_type.toLowerCase()
        if (unitType === 'weeks') unitType = 'week'
        else if (unitType === 'months') unitType = 'month'
        // Recurrent product
        metafields = [
          {
            key: 'order_interval_unit',
            value: unitType
          },
          {
            key: 'charge_interval_frequency',
            value: properties.shipping_interval_frequency
          },
          {
            key: 'order_interval_frequency',
            value: properties.shipping_interval_frequency
          },
          {
            key: 'product_type',
            value: 'subscription'
          }
        ]
      } else {
        metafields = [
          {
            key: 'charge_interval_frequency',
            value: null
          },
          {
            key: 'product_type',
            value: 'otp'
          }
        ]
      }

      if (properties) {
        Object.keys(properties).forEach((key) =>
          metafields.push({
            key,
            value: properties[key]
          })
        )
      }

      return {
        metafields: metafields.filter(
          (x) =>
            ![
              'shipping_interval_unit_type',
              'shipping_interval_frequency',
              'subscription_id'
            ].includes(x.key)
        )
      }
    },

    getCookie(name) {
      const nameEQ = name + '='
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
      }
      return null
    },
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
    }
  }
}
</script>
<style lang="scss" scoped>
.add-to-cart-btn {
  display: block;
  width: 100%;
  button {
    width: 100%;
  }
}
</style>
