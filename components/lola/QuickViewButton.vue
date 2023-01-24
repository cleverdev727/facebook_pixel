<template>
  <button class="add-btn" :disabled="isOutOfStock" @click.prevent="handleClick">
    {{ isOutOfStock ? 'Out of stock' : ctaText }}
    <span class="box-message"></span>
  </button>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import productMixin from '@/mixins/product'
import { isOutOfStock } from '~/helpers/product'

export default {
  mixins: [productMixin],
  props: {
    quickAddProduct: {
      type: Object,
      required: true
    },
    ctaText: {
      type: String,
      default: 'Quick View'
    }
  },
  computed: {
    ...mapState('quick-view', ['quickViewVisible']),
    isOutOfStock() {
      return isOutOfStock(this.quickAddProduct, this.quickAddProduct.tags)
    }
  },
  methods: {
    ...mapMutations('quick-view', ['toggleQuickView']),
    ...mapActions('events', ['productReorder']),
    handleClick() {
      this.setProduct(this.quickAddProduct)
      this.updateSelectedVariantId()
      // GA
      if (this.ctaText === 'Buy again') {
        this.productReorder()
      }
      this.toggleQuickView()
    }
  }
}
</script>
