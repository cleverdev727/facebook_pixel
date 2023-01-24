<template>
  <div class="product__media">
    <div class="carousel" :class="{ centered: !loaded }">
      <div v-show="loaded" class="carousel--media">
        <template v-for="(file, index) in media">
          <nuxt-img
            v-if="file.type === 'image'"
            :key="index"
            :alt="productName"
            :src="file.src"
            class="fade"
          />
          <product-video
            v-else
            :key="file.src"
            :source="file.src"
            :show-controls="false"
            :loop="true"
          />
        </template>
      </div>
      <div v-if="!loaded" class="carousel--loader">
        <loader />
      </div>
      <div v-else class="dots">
        <div
          v-for="(file, index) in media"
          :key="index"
          class="dot"
          :class="{ active: activeMediaIndex === index }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from './Loader'
export default {
  components: {
    Loader
  },
  props: {
    productName: {
      type: String,
      required: true
    },
    media: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      activeMediaIndex: 0,
      mediaContainer: null,
      loadedMedia: 0,
      setScrollTimeout: null
    }
  },
  computed: {
    loaded() {
      const loaded = this.loadedMedia === this.media.length

      return loaded
    }
  },
  watch: {
    media: {
      handler() {
        if (this.mediaContainer) {
          this.mediaContainer.scrollLeft = 0
          this.activeMediaIndex = 0
        }
      }
    }
  },
  beforeMount() {
    this.media.forEach(({ src, type }) => {
      const elementType = type === 'image' ? 'img' : 'video'
      const element = document.createElement(elementType)

      if (elementType === 'img') {
        element.onload = () => {
          this.loadedMedia++
        }
      } else {
        this.loadedMedia++
      }

      element.src = src
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.mediaContainer = document.querySelector('.carousel--media')
      if (this.mediaContainer) {
        this.mediaContainer.onscroll = () => this.handleMediaScroll()
      }
    })
  },
  methods: {
    getMediaWidth() {
      return this.mediaContainer.querySelector('img, video').clientWidth
    },
    getNextActiveSetIndex(scrollWidth, currentIndex = 0) {
      const imageWidth = this.getMediaWidth()
      if (scrollWidth <= imageWidth * 0.8) return currentIndex

      const newScrollWidth = scrollWidth - imageWidth
      return this.getNextActiveSetIndex(newScrollWidth, currentIndex + 1)
    },
    handleMediaScroll() {
      window.clearTimeout(this.setScrollTimeout)
      this.setScrollTimeout = setTimeout(() => {
        this.activeMediaIndex = this.getNextActiveSetIndex(
          this.mediaContainer.scrollLeft
        )
      }, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.product__media {
  margin: 0;
  padding: 0;
  width: auto;

  .carousel {
    position: relative;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    width: 100%;

    &.centered {
      justify-content: center;
      align-items: center;
    }

    &--media {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      scroll-snap-type: x mandatory;
      overflow-x: scroll;
      scrollbar-color: transparent; /* Firefox */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* Internet Explorer 10+ */
      scroll-behavior: smooth;

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

      > * {
        width: 100%;
        max-width: initial;
        scroll-snap-align: start;
      }

      ::v-deep {
        .product-video {
          display: flex;
          background: #000;
          max-height: 100vw;

          video {
            min-width: 100vw;
            max-width: 100%;
          }
        }
      }
    }

    .dots {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 16px auto;
      display: flex;
      justify-content: center;
      margin-top: 48px;
      width: auto;

      .dot {
        background-color: #fff;
        margin-right: 16px;
        width: 11px;
        height: 11px;
        border-radius: 50%;

        &:last-of-type {
          margin: 0;
        }

        &.active {
          background-color: #a8a8a8;
        }
      }
    }
  }

  @media screen and (min-width: 769px) {
    display: none;
  }
}
</style>
