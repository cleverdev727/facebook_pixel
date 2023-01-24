<template>
  <div class="content">
    <ul class="product-recommendations">
      <product-card
        v-for="(product, index) in products"
        :key="`${product.handle}-${index}`"
        :product="product"
      />
    </ul>
  </div>
</template>

<script>
import ProductCard from '@/components/lola/ProductCard.vue'

export default {
  components: { ProductCard },
  props: {
    products: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  overflow-x: auto;
  transition: all ease-in 0.25s;

  .product-recommendations {
    grid-auto-flow: column;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    max-width: none;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(6, max-content);
    padding: 30px 0px;
    gap: 20px 24px;

    @media screen and (max-width: 1070px) {
      padding: 20px 0px;
    }

    @media screen and (max-width: 600px) {
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      overflow-x: auto;
      display: flex;
      gap: 16px;
      padding: 20px 15px;
    }
  }
}
</style>
