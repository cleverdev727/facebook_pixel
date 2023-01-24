<template>
  <div class="flyout-recommendation__content">
    <nuxt-img
      :src="product.featuredMedia.thumbnailSrc"
      :alt="product.title"
      height="100"
      width="100"
    />
    <div class="flyout-recommendation__content_inner">
      <h4 class="fw-md text--blue">{{ product.title }}</h4>
      <span class="price"
        ><product-price
          :price="product.priceRange.max"
          :currency-code="product.priceRange.currencyCode"
      /></span>
      <button @click="addToCart">Add</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    product: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    addToCart() {
      this.$emit('addToCart', this.product)
    }
  }
}
</script>

<style lang="scss" scoped>
.flyout-recommendation__content {
  display: flex;
  min-width: fit-content;
  border: 1px solid #ccc;
  padding: 0.5rem;
  scroll-snap-align: start;

  .flyout-recommendation__content_inner {
    display: flex;
    flex-direction: column;
    padding-left: 8px;

    button {
      font-size: 14px;
      align-self: flex-start;
      height: 26px;
      margin-top: 6px;
      padding: 0 22px;
    }

    span {
      max-width: 160px;
    }
  }

  .price {
    font-size: 12px;
    line-height: 22px;
  }
}
</style>
