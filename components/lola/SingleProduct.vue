<template>
  <form action="/cart/add" method="post" class="single-product product-form">
    <assortment v-if="hasAssortments" :assortment-data="assortmentData" />
    <div v-if="isSubscriptionOnly">
      <input type="hidden" name="purchase_type" :value="purchaseType" />
      <template v-if="isPrepaidProduct || isDailyMultivitamin">
        <subscription-type-selector @update="handlePrepaidSelection" />
      </template>
      <template v-else>
        <div id="rc_container">
          <delivery-frequency-selector />
        </div>
      </template>
    </div>
    <div v-else-if="isGiftCard">
      <gift-card-variant-selector />
    </div>
    <div v-else-if="product.metadata.useSizeSelector">
      <size-selector />
    </div>
    <div v-else>
      <purchase-type-selector @update="handleFrequencySelection" />
    </div>
    <input type="hidden" name="id" :value="selectedVariantId" />
    <input type="hidden" name="shopify_variant_id" :value="selectedVariantId" />
    <input type="hidden" name="quantity" :value="selectedQuantity" />
    <input
      v-if="product.metadata.isValuePack"
      type="hidden"
      name="properties[fulfillable_quantity]"
      value="8"
    />
  </form>
</template>

<script>
import assortmentMixins from '@/mixins/assortmentMixins'
import prepayMixins from '@/mixins/prepayMixins'
import productMixins from '@/mixins/product'
import subscriptionMixins from '@/mixins/subscriptions'
import SizeSelector from './SizeSelector'
import DeliveryFrequencySelector from './DeliveryFrequencySelector'
import GiftCardVariantSelector from './GiftCardVariantSelector'
import Assortment from './Assortment'
import PurchaseTypeSelector from './PurchaseTypeSelector'
import SubscriptionTypeSelector from './SubscriptionTypeSelector'
export default {
  components: {
    Assortment,
    DeliveryFrequencySelector,
    GiftCardVariantSelector,
    PurchaseTypeSelector,
    SizeSelector,
    SubscriptionTypeSelector
  },
  mixins: [assortmentMixins, prepayMixins, productMixins, subscriptionMixins],
  data() {
    return {
      assortmentData: null,
      frequency: 0,
      prepaidSelection: null
    }
  },
  created() {
    this.updateSelectedVariantId()
  },
  beforeMount() {
    this.$emit('ready')
  }
}
</script>

<style lang="scss" scoped>
.single-product {
  padding: 28px 0 0;
  display: block;
  flex-direction: row;

  @media screen and (max-width: 768px) {
    padding-top: 30px;
  }
}
</style>
