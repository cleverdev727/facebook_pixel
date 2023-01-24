<template>
  <div class="size-selector">
    <section
      v-if="popupContent"
      class="size-options flex justify--space-between"
    >
      <p class="size-options-text"><strong>Size options</strong></p>
      <p class="size-options-chart">
        <span class="text--link" tabindex="0" @click.prevent="showSizeChart"
          >Size chart</span
        >
      </p>
    </section>
    <div class="variants">
      <div
        v-for="(variant, index) in variants"
        :key="index"
        class="variant flex"
      >
        <input type="checkbox" :checked="selectedVariantId == variant.id" />
        <label class="variant-selector" @click="handleClick(variant.id)">
          <p class="product-price">
            {{ variant.title }}
          </p>
        </label>
      </div>
    </div>
    <input
      v-if="appendSkuAsLineItem"
      :name="`properties[_SKU:${lineItemSku}]`"
      type="hidden"
      value="1"
    />
    <input
      v-for="(value, key) in additionalSkuInfo"
      :key="key"
      :name="`properties[_SKU:${key}]`"
      type="hidden"
      :value="value"
    />
    <popup
      :show="sizeShowPopup"
      :fill-box="true"
      @modal-clicked="sizeShowPopup = false"
      @close-popup="sizeShowPopup = false"
    >
      <div v-html="popupContent"></div>
    </popup>
  </div>
</template>

<script>
import { getShopifyVariantId } from '@/helpers/product'
import assortmentMixins from '@/mixins/assortmentMixins'
import modalMixins from '@/mixins/modalMixins'
import productMixins, { getPopupContent } from '@/mixins/product'
import Popup from './Popup.vue'

export default {
  components: { Popup },
  mixins: [assortmentMixins, modalMixins, productMixins],
  data() {
    return {
      modalVisible: false,
      sizeShowPopup: false
    }
  },
  computed: {
    lineItemSku() {
      const selectedVariantId = this.selectedVariantId + ''
      const variant =
        this.variants.find((x) => x.id.toString() === selectedVariantId) || {}
      return (variant.sku || '').substring(0, 5)
    },
    popupContent() {
      return getPopupContent(this.contentPopups, 'size-chart')
    },
    variants() {
      return this.product.variants
        .map((x) => {
          return { ...x, id: getShopifyVariantId(x.id) }
        })
        .sort((a, b) => a.price - b.price)
    }
  },
  beforeMount() {
    this.setAdditionalSkuInfo(this.getAdditionalSkuInfo())
  },
  methods: {
    handleClick(id) {
      this.updateSelectedVariantId(id)
    },
    hideSizeChart() {
      this.modalVisible = false
    },
    showSizeChart() {
      this.sizeShowPopup = true
    }
  }
}
</script>

<style lang="scss" scoped>
.close-icon {
  position: absolute;
  top: 0;
  right: 0px;
  padding: 12px;
}

.img-container {
  position: relative;
  max-width: 800px;
}

.variants {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 30px;

  .variant {
    width: calc(50% - 15px);
  }

  .product-price {
    text-transform: none;
    margin: 0;
  }
}

input[type='checkbox'] {
  visibility: hidden;
  height: 0;
  width: 0;
  margin: 0;

  &:checked + label {
    border-width: 2px;
    border-color: $dark-blue;
  }
}
input + label {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  margin: 0;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  width: 100%;
  cursor: pointer;
}
</style>
