<template>
  <div class="flyout-recommendation">
    <header>
      <h4 class="fw-md text--blue">You might also like...</h4>
      <div class="slider-buttons">
        <chevron-circle-left
          :class="{ disabled: activeMediaIndex === 0 }"
          @click.native="move('left')"
        />
        <chevron-circle-right
          :class="{ disabled: activeMediaIndex === items.length - 1 }"
          @click.native="move('right')"
        />
      </div>
    </header>
    <div class="list">
      <cart-recommendation-item
        v-for="product in items"
        :key="product.handle"
        :product="product"
        @addToCart="addToCart"
      >
      </cart-recommendation-item>
    </div>
    <div v-if="items.length" class="dots">
      <div
        v-for="(file, index) in items"
        :key="index"
        class="dot"
        :class="{ active: activeMediaIndex === index }"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ChevronCircleLeft from './icons/ChevronCircleLeft.vue'
import ChevronCircleRight from './icons/ChevronCircleRight.vue'

export default {
  components: { ChevronCircleLeft, ChevronCircleRight },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeMediaIndex: 0,
      slideContainer: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      const element = this.$el
      this.slideContainer = element.querySelector('.list')
      if (this.slideContainer) {
        this.slideContainer.onscroll = () => this.handleSlideScroll()
      }
    })
  },
  methods: {
    ...mapActions('cart', ['addLineItem']),
    addToCart(product) {
      const lineItem = {
        image: product.featuredMedia,
        title: product.title,
        variant: product.variants[0],
        quantity: 1,
        productId: product.id,
        handle: product.handle,
        vendor: product.vendor,
        tags: product.tags,
        metafields: [
          {
            key: 'charge_interval_frequency',
            value: null
          },
          {
            key: 'product_type',
            value: 'otp'
          }
        ],
        metadata: product.metadata
      }
      this.addLineItem(lineItem)
    },
    getSlideWidth() {
      // Use dimensions of smallest slide
      const slideWidths = this.getSlideWidths()
      let width = Number.MAX_VALUE
      slideWidths.forEach((x) => (width = Math.min(width, x)))

      return width
    },
    getSlideWidths() {
      const slides = this.slideContainer.querySelectorAll(
        '.flyout-recommendation__content'
      )

      const widths = []

      slides.forEach((slide) => {
        widths.push(slide.clientWidth)
      })

      return widths
    },
    getNextActiveSetIndex(currentIndex = 0, currentTotal = 0) {
      const widths = this.getSlideWidths()
      const gap = 30
      const width = widths[currentIndex - 1] || 0
      const margin = currentTotal + gap + width

      if (this.slideContainer.scrollLeft <= margin) {
        return currentIndex
      }

      currentIndex++
      currentTotal += width

      if (currentIndex === widths.length - 1) return currentIndex

      return this.getNextActiveSetIndex(currentIndex, currentTotal)
    },
    handleSlideScroll() {
      window.clearTimeout(this.setScrollTimeout)
      this.setScrollTimeout = setTimeout(() => {
        this.activeMediaIndex = this.getNextActiveSetIndex()
      }, 300)
    },
    move(direction) {
      const slides = this.slideContainer.querySelectorAll(
        '.flyout-recommendation__content'
      )

      const slide = slides[this.activeMediaIndex]
      const setWidth = slide.clientWidth
      const currentScrollPosition = this.slideContainer.scrollLeft
      direction === 'left'
        ? (this.slideContainer.scrollLeft = currentScrollPosition - setWidth) &&
          this.activeMediaIndex--
        : (this.slideContainer.scrollLeft = currentScrollPosition + setWidth) &&
          this.activeMediaIndex++
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  scrollbar-color: transparent; /* Firefox */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scroll-behavior: smooth;
  column-gap: 10px;

  &::-webkit-scrollbar {
    display: none;
    /* WebKit */
    width: 0;
    height: 0;
    color: transparent;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}

header {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
}

.slider-buttons {
  display: flex;
  gap: 8px;
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.dots {
  margin: 10px auto;
  display: none;
  gap: 4px;

  .dot {
    background-color: #fff;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid $dark-blue;

    &.active {
      background-color: $dark-blue;
    }
  }
}

@media screen and (max-width: $medium-screen) {
  .slider-buttons {
    display: none;
  }

  .dots {
    display: flex;
  }
}
</style>
