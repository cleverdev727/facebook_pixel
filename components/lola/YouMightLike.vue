<template>
  <div class="container mx-auto">
    <div v-show="loading" class="flex justify--center">
      <loader />
    </div>
    <section v-if="products.length > 0" class="you-might-like">
      <p class="header">You might like</p>
      <product-recommendations :products="products" />
    </section>
  </div>
</template>

<script>
import ProductRecommendations from '@/components/lola/ProductRecommendations.vue'
import recommendationMixin from '@/mixins/recommendations'
import Loader from './Loader.vue'

export default {
  components: { Loader, ProductRecommendations },
  mixins: [recommendationMixin],
  props: {
    handles: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      products: []
    }
  },
  watch: {
    products: {
      handler(products) {
        if (products.length) {
          this.$emit('loaded')
        }
      }
    }
  },
  async mounted() {
    this.loading = true
    this.products = await this.getProductsByHandles(this.handles)
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.you-might-like {
  .header {
    text-align: center;
    letter-spacing: 0px;
    font: normal normal normal 24px/36px Apercu Pro;
    margin-bottom: 10px;
  }

  img {
    width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .you-might-like {
    padding: 0 16px;

    p {
      font-size: 14px;
    }

    .product--image {
      width: 165px;
    }
  }
}
</style>
