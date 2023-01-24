<template>
  <div class="gift-card-selector">
    <div class="variants">
      <div
        v-for="(variant, index) in variants"
        :key="index"
        class="variant flex"
      >
        <input type="checkbox" :checked="selectedVariantId == variant.id" />
        <label class="variant-selector" @click="handleClick(variant.id)">
          <p class="product-price">
            {{ formatPrice(variant.priceRange.max) }}
          </p>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import productMixins from '@/mixins/product'
export default {
  mixins: [productMixins],
  data() {
    return {
      selectedVariant: null
    }
  },
  computed: {
    variants() {
      return this.product.variants
        .map((x) => x)
        .sort(
          (a, b) => parseFloat(a.priceRange.max) - parseFloat(b.priceRange.max)
        )
    }
  },
  mounted() {},
  methods: {
    handleClick(id) {
      // this.selectedVariant = id;
      this.updateSelectedVariantId(id)
    }
  }
}
</script>

<style lang="scss" scoped>
$hero-blue: #92bbd9;
$dark-blue: #4e6282;

.variants {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 30px;
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

.product-price {
  text-transform: none;
  margin: 0;
}
</style>
