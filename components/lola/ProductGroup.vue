<template>
  <div class="product-group">
    <p v-if="$fetchState.pending">Fetching products...</p>
    <product-recommendations v-if="products.length" :products="productsList" />
  </div>
</template>

<script>
import ProductRecommendations from '@/components/lola/ProductRecommendations.vue'
import recommendationMixin from '@/mixins/recommendations'
import { addObjectFieldsToParent } from '~/helpers/general'

export default {
  components: { ProductRecommendations },
  mixins: [recommendationMixin],
  props: {
    products: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      productsList: []
    }
  },
  async fetch() {
    const allProducts = await this.getProductsByHandles(
      this.products.map((x) => addObjectFieldsToParent(x).handle.split('::')[0])
    )

    this.productsList = allProducts
  }
}
</script>
