<template>
  <form action="/cart/add" method="post" class="bundle-product product-form">
    <div class="bundle-product--details">
      <div class="img">
        <nuxt-img
          :src="product.metadata.productCardBoxedImage"
          :alt="product.title"
        />
      </div>
      <div class="info">
        <span class="count">{{ product.metadata.quantityInfo }}</span>
        <span v-html="product.description"></span>
      </div>
    </div>
    <assortment
      v-if="hasAssortments"
      :assortment-data="assortmentData"
      :product-key="productKey"
    />
    <div v-if="isSubscriptionOnly">
      <input type="hidden" name="purchase_type" :value="purchaseType" />
      <template v-if="isPrepaidProduct">
        <subscription-type-selector
          :product-key="productKey"
          @update="handlePrepaidSelection"
        />
      </template>
      <template v-else>
        <div id="rc_container">
          <delivery-frequency-selector :product-key="productKey" />
        </div>
      </template>
    </div>
    <div v-else>
      <purchase-type-selector
        :product-key="productKey"
        @update="handleFrequencySelection"
      />
    </div>
    <div class="selector">
      <span>Quantity per delivery</span>
      <select v-model="selectedQuantity_">
        <option v-for="quantity in [1, 2, 3]" :key="quantity" :value="quantity">
          {{ quantityText(quantity) }}
        </option>
      </select>
      <chevron-down />
    </div>
    <input type="hidden" name="id" :value="selectedVariantId" />
    <input type="hidden" name="shopify_variant_id" :value="selectedVariantId" />
    <input type="hidden" name="quantity" :value="selectedQuantity" />
  </form>
</template>

<script>
import assortmentMixins from '@/mixins/assortmentMixins'
import prepayMixins from '@/mixins/prepayMixins'
import Assortment from './Assortment'
import ChevronDown from './icons/ChevronDown'
import PurchaseTypeSelector from './PurchaseTypeSelector'
import DeliveryFrequencySelector from './DeliveryFrequencySelector'
import SubscriptionTypeSelector from './SubscriptionTypeSelector'

export default {
  components: {
    Assortment,
    ChevronDown,
    DeliveryFrequencySelector,
    PurchaseTypeSelector,
    SubscriptionTypeSelector
  },
  mixins: [assortmentMixins, prepayMixins],
  props: {
    productKey: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      assortmentData: null,
      frequency: 0,
      prepaidSelection: null,
      selectedQuantity_: 1
    }
  },
  watch: {
    selectedQuantity_: {
      handler(qty) {
        this.setSelectedQuantity(qty)
      }
    }
  },
  created() {
    this.setPurchaseType(this.defaultPurchaseType, this.productKey)
    this.updateSelectedVariantId()
  },
  methods: {
    quantityText(quantity) {
      return (
        quantity +
        ' ' +
        this.pluralize(this.product.metadata.container, quantity)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.bundle-product {
  &--details {
    display: flex;
    margin-bottom: 24px;

    > {
      .img {
        width: 90px;
      }

      .info {
        flex: 1;
        padding-left: 12px;
        display: flex;
        flex-direction: column;

        p,
        span {
          font-family: Apercu Light;
        }

        .count {
          font-family: Apercu Medium;
        }
      }
    }

    p:last-of-type {
      margin-bottom: 0;
    }
  }

  .selector {
    position: relative;
    display: flex;
    font: 16px/23px 'Apercu Medium';
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    select {
      font-family: 'Apercu Medium', sans-serif;
      margin: 0;
      cursor: pointer;
      border: 1px solid #dcdcdc;
      border-radius: 2px;
      margin-left: 20px;
      max-width: 200px;
      color: #514944;
    }

    svg {
      width: 14px;
      height: 14px;
      position: absolute;
      top: 30%;
      pointer-events: none;
      right: 12px;
    }
  }
}
</style>
