<template>
  <ul class="collection--products">
    <slot name="promo-card"></slot>
    <product-card
      v-for="product in products"
      :key="product.handle"
      :product="product"
    />
  </ul>
</template>

<script>
import ProductCard from '@/components/lola/ProductCard.vue'
export default {
  components: { ProductCard },
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.collection--products {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 24px;
  grid-template-areas: '. . . col-promo';

  ::v-deep {
    .collection-promo-container {
      position: relative;
      grid-area: col-promo;

      .copy-container {
        padding: 15px 20px;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }

  @media screen and (max-width: $tablet-landscape) {
    padding: 0;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: '. . col-promo';
  }

  @media screen and (max-width: $tablet-screen) {
    padding: 0;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: '. col-promo';

    ::v-deep {
      .collection-promo-container {
        font-size: 15px;

        p {
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
