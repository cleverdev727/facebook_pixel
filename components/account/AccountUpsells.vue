<template>
  <client-only>
    <section class="account_upsell">
      <h2 class="account_upsell_header">Products you may like</h2>
      <div class="account_upsell_arrows">
        <span @click="handleScrollLeft">
          <chevron-left
            :class="{ 'account_upsell_arrow-active': leftArrowActive }"
            class="account_upsell_arrow"
          />
        </span>
        <span @click="handleScrollRight">
          <chevron-right
            :class="{ 'account_upsell_arrow-active': rightArrowActive }"
            class="account_upsell_arrow"
          />
        </span>
      </div>
      <div class="account_upsell_list">
        <li
          v-for="product in products"
          :key="product.id"
          class="account_upsell_product"
        >
          <nuxt-img
            v-if="product.media"
            class="account_upsell_product-img"
            :src="product.media[0].src"
            :alt="product.title"
          />
          <div class="account_upsell_product-desc">
            <span
              class="account_upsell_product-title"
              @click="showQuickAdd(product)"
              >{{ product.title }}</span
            >
            <span class="account_upsell_product-price"
              >Starting at {{ product.priceRange.min | dollarValue }}</span
            >
          </div>
          <quick-view-button
            class="button"
            cta-text="Add to order"
            :quick-add-product="product"
          />
        </li>
      </div>
      <div class="account_upsell_dots">
        <div
          v-for="dot in dotsCount"
          :key="dot"
          class="account_upsell_dot"
          :class="{ 'account_upsell_dot-active': dot === activeDot }"
          @click="setActiveDot(dot)"
        />
      </div>
    </section>
  </client-only>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import productMixin from '@/mixins/product'
import datePriceFilters from '@/mixins/datePriceFilters'
import QuickViewButton from '@/components/lola/QuickViewButton.vue'
import chevronRight from '@/components/lola/icons/ChevronCircleRight.vue'
import chevronLeft from '@/components/lola/icons/ChevronCircleLeft.vue'

export default {
  components: { QuickViewButton, chevronRight, chevronLeft },
  mixins: [productMixin, datePriceFilters],
  props: {
    addresses: {
      type: Array,
      default: () => {
        return []
      }
    },
    products: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      listDiv: null,
      scrollLeft: null,
      scrollWidth: null,
      clientWidth: null,
      dotsCount: null,
      activeDot: null
    }
  },
  computed: {
    ...mapState('quick-view', ['quickViewVisible']),
    rightArrowActive() {
      const maxScrollLeft = this.scrollWidth - this.clientWidth
      return this.scrollLeft < maxScrollLeft
    },
    leftArrowActive() {
      return this.scrollLeft !== 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.listDiv = document.querySelector('.account_upsell_list')
      if (this.listDiv) {
        this.setListContainer()
        this.listDiv.addEventListener('scroll', this.setListContainer)
        window.addEventListener('resize', this.setListContainer)
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.setListContainer)
    window.removeEventListener('resize', this.setListContainer)
  },
  methods: {
    ...mapMutations('quick-view', ['toggleQuickView']),
    showQuickAdd(product) {
      this.setProduct(product)
      this.updateSelectedVariantId()
      this.toggleQuickView()
    },
    setListContainer() {
      this.clientWidth = this.listDiv.clientWidth
      this.scrollLeft = this.listDiv.scrollLeft
      this.scrollWidth = this.listDiv.scrollWidth
      this.dotsCount = Math.ceil(this.scrollWidth / this.clientWidth)
      this.activeDot = Math.ceil(
        (this.scrollLeft + this.clientWidth) / this.clientWidth
      )
    },
    handleScrollLeft() {
      this.listDiv.scrollLeft = this.scrollLeft - this.clientWidth
    },
    handleScrollRight() {
      this.listDiv.scrollLeft = this.scrollLeft + this.clientWidth
    },
    setActiveDot(dot) {
      const scrollLeft = this.clientWidth * (dot - 1)
      this.listDiv.scrollLeft = scrollLeft
    }
  }
}
</script>

<style lang="scss" scoped>
.account_upsell {
  margin-bottom: 1em;
  min-height: 20em;

  &_header {
    font-size: 20px;
    font-weight: normal;

    @media (max-width: 600px) {
      padding-left: 0.8em;
    }
  }

  &_arrows {
    display: flex;
    justify-content: flex-end;
    padding-right: 1em;

    @media (max-width: 600px) {
      display: none;
    }
  }

  &_arrow {
    margin-left: 0.5em;
    opacity: 0.4;
  }

  &_arrow-active {
    opacity: 1;
  }

  &_product {
    flex: 0 0 auto;
  }

  &_list {
    display: flex;
    justify-content: space-between;
    list-style-type: none;
    overflow-x: auto;
    padding-bottom: 2em;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      /* safari, chrome & opera */
      display: none;
    }
  }

  &_product-img {
    height: 180px;
    margin: 1em;
  }

  &_product-desc {
    height: 5em;
    padding: 0 1em;
    max-width: 12em;
  }

  &_product-title {
    color: #4e6282;
    font-size: 14px;
    display: block;
    padding-bottom: 2px;
  }

  &_product-price {
    font-size: 14px;
    display: block;
  }

  .button {
    margin: auto;
    width: 90%;
  }

  &_dots {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2em;
  }

  &_dot {
    cursor: pointer;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #4e6282;
    opacity: 0.4;
    margin-right: 18px;
  }

  &_dot-active {
    opacity: 1;
  }
}
</style>
