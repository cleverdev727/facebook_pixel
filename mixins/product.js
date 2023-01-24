import { mapGetters, mapMutations, mapState } from 'vuex'
import { encode } from 'js-base64'
import {
  getShopifyVariantId,
  isGiftCard,
  getStartingPrice
} from '@/helpers/product'

export default {
  computed: {
    appendSkuAsLineItem() {
      return ((this.product || {}).metadata || {}).appendSkuAsLineItem
    },
    defaultPurchaseType() {
      /* The logic for selecting a default purchase type in the
          original liquid code is written in such a way that it will
          always default to `autodeliver`.
          I don't know why, so, until that is clarified, I am commenting
          out the logic below and hardcoding the `expected` value. */

      // const {product} =  this.product;
      // if (!product) return "";
      // return this.isSubscriptionOnly || product.metadata.selectSubscriptionFirst
      //   ? "autodeliver"
      //   : "onetime";

      // Default to 'onetime' for OTPs re-orders
      return this.$route.path.includes('/account/orders')
        ? 'onetime'
        : 'autodeliver'
    },
    ...mapState('user', ['locale']),
    ...mapGetters('global', ['activeProduct', 'globalPrepayData']),
    isBundle() {
      return this.shopifyProduct.metadata.isBundle
    },
    isGiftCard() {
      return isGiftCard(this.product)
    },
    isPrepaidProduct() {
      return (this.product?.metadata?.prepaidProducts || []).length > 0
    },
    isDailyMultivitamin() {
      return this.product?.handle === 'daily-supplement' || false
    },
    isRechargePage() {
      return this.$route.path.includes('/account')
    },
    isRechargeEdit() {
      return this.$route.path.includes('/account/edit/')
    },
    isRechargeAdd() {
      return this.$route.path.includes('/account/add/')
    },
    isRechargeUpsell() {
      return this.$route.path === '/account'
    },
    isTrialSet: () => false,
    modalInfo() {
      const { howSubscriptionsWork = {}, whatShouldIOrder = {} } =
        this.product.metadata
      return {
        howSubscriptionsWork,
        whatShouldIOrder
      }
    },
    product() {
      const key = this.productKey || 0
      const product = this.$store.getters['global/product__']
      return product(key)
    },
    purchaseType() {
      const key = this.productKey || 0
      return this.$store.getters['global/purchaseType'](key)
    },
    selectedQuantity() {
      const key = this.productKey || 0
      return this.$store.getters['global/selectedQuantity'](key)
    },
    selectedVariant() {
      let variant = null
      if (!this.selectedVariantId) return variant

      const variantToDuplicate = this.product.metadata.variantToDuplicate
      const reverseID =
        Object.keys(variantToDuplicate).find(
          // eslint-disable-next-line eqeqeq
          (key) => variantToDuplicate[key] == this.selectedVariantId
        ) || this.selectedVariantId

      const encodedId = encode(`gid://shopify/ProductVariant/${reverseID}`)

      // Check if this is a prepaid product
      if (this.isPrepaidProduct) {
        // Search through prepaid products first
        const product = this.product.metadata.prepaidProducts.find((x) => {
          const _variant = x.variants.find((y) => y.id === encodedId)
          if (_variant) {
            variant = _variant
            return true
          }

          return false
        })

        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.product__ = product || this.product
      }

      if (!variant) {
        // Search through product's main variants
        variant = this.product.variants.find((x) => x.id === encodedId)
      }

      if (!variant) {
        // Select first available variant
        variant = this.product.variants[0]
      }

      return variant
    },
    selectedVariantId() {
      const key = this.productKey || 0
      return this.$store.getters['global/selectedVariantId'](key)
    },
    shopifyProduct() {
      return this.$store.getters['global/shopifyProduct']
    },
    startingAtPrice() {
      const price = getStartingPrice(this.product)
      const displayPrice = price % 1 === 0 ? price : price.toFixed(2)

      return this.locale.symbol + displayPrice
    }
  },
  methods: {
    calculatePercentageOff(low, high) {
      return ((high - low) / high) * 100
    },
    ...mapMutations('global', [
      'setActiveProduct',
      'setPurchaseType__',
      'setProduct',
      'setSelectedVariantId__',
      'setSelectedQuantity__',
      'updateProduct__'
    ]),
    getCurrency() {
      return this.locale.symbol
    },
    getFirstOrSelectedVariantId(variants = []) {
      const variantId = this.$route?.query?.variant
      if (variantId) return variantId

      return getShopifyVariantId(variants[0]?.id)
    },
    getPrice(priceType, float = false) {
      const { product } = this
      const { oneTimePrice, subscriptionPrice } = product.metadata
      let price = priceType === 'onetime' ? oneTimePrice : subscriptionPrice
      price = parseFloat(price || 0) / 100
      if (float) {
        price = price.toFixed(2)
      }
      return price
    },
    getPriceWithCurrency(priceType, float) {
      return this.getCurrency() + this.getPrice(priceType, float)
    },
    setPurchaseType(type) {
      const key = this.productKey || 0
      this.setPurchaseType__({ type, key })
      const price =
        type === 'onetime'
          ? this.getPriceWithCurrency('onetime')
          : this.getPriceWithCurrency()

      const { metadata } = this.product
      metadata.pdpProductPrice = price
      this.updateProduct(key, metadata)
    },
    setSelectedVariantId(variantId) {
      const key = this.productKey || 0
      this.setSelectedVariantId__({ key, variantId })
    },
    setSelectedQuantity(quantity) {
      const key = this.productKey || 0
      this.setSelectedQuantity__({ key, quantity })
    },
    updateProduct(key, productInfo) {
      this.updateProduct__({ key, productInfo })
    },
    updateSelectedVariantId(variantId, purchaseType) {
      const decodedVariantId = getShopifyVariantId(variantId)

      let firstOrSelectedVariantId = this.getFirstOrSelectedVariantId(
        this.product.variants
      )

      let {
        // eslint-disable-next-line prefer-const
        variantToDuplicate
      } = this.product.metadata

      if (purchaseType === 'onetime') {
        this.setSelectedVariantId(firstOrSelectedVariantId)
        return
      }

      // Replace default variant ID if this is a prepaid product
      if (this.activeProduct) {
        firstOrSelectedVariantId = this.getFirstOrSelectedVariantId(
          this.activeProduct.variants
        )
      }

      const _variantId = decodedVariantId || firstOrSelectedVariantId
      const rechargeId = variantToDuplicate[_variantId]
      const selectedVariantId = rechargeId || _variantId
      this.setSelectedVariantId(selectedVariantId)
    }
  }
}

export const getPopupContent = (contentsObj, key) => {
  const { text = '', image } = contentsObj[key] || {}
  if (image) {
    return `
            <img class="content-popup-img" src="${image.fields.file.url}" alt="${image.fields.title}" />
          `
  }
  if (text) {
    return `
            <div class="side-modal__content-sub">
              ${text}
            </div>
          `
  }

  return null
}
