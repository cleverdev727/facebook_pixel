<template>
  <section class="product__images desktop">
    <ul class="product__images--list">
      <li
        v-for="(file, index) in media"
        :key="index"
        class="product__images-list--variant"
        :class="{ 'is-active': index === activeMediaIndex }"
        @click="setIndex(index)"
      >
        <nuxt-img
          v-if="file.type === 'image'"
          :alt="productName"
          :src="file.src"
          class="fade"
        />
        <product-video
          v-else
          :key="file.src"
          :source="file.src"
          :show-controls="false"
          :show-overlay="true"
          :autoplay="false"
        />
      </li>
    </ul>
    <div class="media-viewer">
      <nuxt-img
        v-if="activeMedia.type === 'image'"
        id="fullImage"
        :alt="productName"
        :src="activeMedia.src"
        class="fade"
      />
      <product-video
        v-else
        :key="activeMedia.src"
        :source="activeMedia.src"
        :show-controls="false"
        :loop="true"
      />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    productName: {
      type: String,
      required: true
    },
    media: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeMediaIndex: 0
    }
  },
  computed: {
    activeMedia() {
      return this.media[this.activeMediaIndex]
    }
  },
  methods: {
    setIndex(index) {
      this.activeMediaIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
.product__images {
  display: flex;

  &--list {
    width: 60px;
    margin-right: 28px;
    align-self: flex-start;

    li {
      width: 100%;
      border-radius: 50%;
      background: gainsboro;
      cursor: pointer;
      height: 60px;
      overflow: hidden;

      &.is-active {
        border: 3px solid #514945;
      }

      &:not(:first-child) {
        margin-top: 1rem;
      }

      img {
        height: 100%;
        width: 100%;
        opacity: 0.7;
      }

      ::v-deep {
        .product-video {
          display: flex;
          min-height: 100%;

          video {
            max-width: 100%;
          }
        }
      }
    }
  }

  .media-viewer {
    flex: 1;

    ::v-deep {
      .product-video {
        display: flex;
        background: #000;
        height: 100%;

        video {
          max-width: 100%;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
}
</style>
