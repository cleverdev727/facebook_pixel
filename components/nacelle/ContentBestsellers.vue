<template>
  <div class="container mx-auto">
    <section class="bestsellers">
      <header class="flex flex--items-center">
        <h3 class="mb-0">Bestsellers</h3>
        <div class="tabs flex flex--items-center">
          <div
            class="tab"
            :class="{ active: subActive }"
            @click="switchTab('sub')"
          >
            Subscription
          </div>
          <div
            class="tab"
            :class="{ active: !subActive }"
            @click="switchTab('onetime')"
          >
            One-time
          </div>
        </div>
        <nuxt-link
          to="/collections/"
          class="button button--stripped shop-all desktop-only"
          >Shop all</nuxt-link
        >
      </header>
      <p>Get what you need, on your schedule. Free shipping on orders $25+.</p>
      <div class="tab-contents">
        <div class="content" :class="{ visible: subActive }">
          <ul class="product-recommendations">
            <li
              v-for="(product, index) in tabs[0].fields.productCards"
              :key="product.id"
              class="product"
              :class="{ 'quick-add-panel': showDescription === index }"
              @mouseover="showDescription = index"
              @mouseout="showDescription = null"
            >
              <div class="product--image">
                <nuxt-link
                  :to="'/products/' + product.fields.handle.split('::')[0]"
                  class="gtm-product-card-applicator-tampons"
                >
                  <nuxt-img
                    :alt="product.fields.name"
                    class="fade"
                    :src="product.fields.featuredImageUrl"
                /></nuxt-link>
              </div>
              <div class="product--details">
                <div class="copy">
                  <p class="title">{{ product.fields.name }}</p>
                  <span v-show="showDescription === index" class="description">
                    {{ product.fields.description }}</span
                  >
                </div>
                <div class="price">{{ product.fields.priceInfo }}</div>
              </div>
            </li>
          </ul>
          <div class="progress mobile-only" role="progress">
            <div
              class="progress--bar"
              style="width: 0px; transform: translateX(0px)"
            ></div>
          </div>
        </div>

        <div class="content" :class="{ visible: !subActive }">
          <ul class="product-recommendations">
            <li
              v-for="(product, index) in tabs[1].fields.productCards"
              :key="product.id"
              class="product"
              :class="{ 'quick-add-panel': showDescription === index }"
              @mouseover="showDescription = index"
              @mouseout="showDescription = null"
            >
              <div class="product--image">
                <nuxt-link
                  :to="'/products/' + product.fields.handle.split('::')[0]"
                  class="gtm-product-card-applicator-tampons"
                >
                  <nuxt-img
                    :alt="product.fields.name"
                    class="fade"
                    :src="product.fields.featuredImageUrl"
                /></nuxt-link>
              </div>
              <div class="product--details">
                <div class="copy">
                  <p class="title">{{ product.fields.name }}</p>
                  <span v-show="showDescription === index" class="description">
                    {{ product.fields.description }}
                  </span>
                </div>
                <div class="price">{{ product.fields.priceInfo }}</div>
              </div>
            </li>
          </ul>
          <div class="progress mobile-only" role="progress">
            <div
              class="progress--bar"
              style="width: 0px; transform: translateX(0px)"
            ></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    ctaText: {
      type: String,
      default: ''
    },
    ctaUrl: {
      type: String,
      default: ''
    },
    tabs: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      subActive: true,
      showDescription: null
    }
  },
  methods: {
    switchTab(tab) {
      this.subActive = tab === 'sub'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 120px;
}

.bestsellers {
  margin: 0 0 80px;
  header {
    h3 {
      margin-right: 72px;
    }

    .tabs {
      flex: 4;
    }

    .tab {
      cursor: pointer;
      margin-right: 28px;
      color: #999391;
      &.active,
      &:hover {
        border-bottom: 2px solid #514945;
        color: inherit;
      }
    }

    .shop-all {
      flex: 1;
    }
  }

  .tab-contents {
    .content {
      display: none;
      visibility: hidden;
      transition: all ease-in 0.25s;
      opacity: 0;

      .product-recommendations {
        max-width: none;
        width: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding: 24px 0;
        gap: 20px 24px;

        .product {
          display: flex;
          flex-direction: column;
          padding: 0;
          position: relative;
        }

        .product--details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;

          .title {
            font-size: 16px;
            font-weight: bold;
            line-height: 20px;
            margin-bottom: 4px;
          }

          .description {
            font-size: 14px;
            line-height: 1;
          }
        }

        .quick-add-panel {
          padding: 15px;
          border-radius: 2px;
          box-shadow: 0 3px 6px #00000029;
          background-color: #fff;
          animation: scale-display--reversed 0.3s;
        }

        @keyframes scale-display--reversed {
          0% {
            display: block;
            opacity: 1;
          }

          99% {
            display: block;
            opacity: 0;
          }

          100% {
            display: none;
            opacity: 0;
          }
        }

        @media screen and (max-width: 1070px) {
          padding: 20px 20px;

          .product {
            grid-template-areas:
              'title image info'
              'customizer image info';
            grid-template-columns: 1fr 1.25fr 1fr;
            grid-template-rows: auto 1fr;
          }
        }

        @media screen and (max-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 20px 15px;

          .product {
            align-items: start;
            grid-gap: 0 43px;
          }
        }
      }

      &.visible {
        display: block;
        visibility: visible;
        opacity: 1;
      }
    }
  }

  img {
    width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .bestsellers {
    padding: 0 16px;

    header {
      margin-bottom: 14px;
      .tabs {
        justify-content: flex-end;
      }
      h3,
      .tab:last-of-type {
        margin-right: 0;
      }
    }

    p {
      font-size: 14px;
    }

    .content {
      overflow-x: auto;

      .product-recommendations {
        grid-auto-flow: column;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;

        .product {
          scroll-snap-align: start;
        }

        .product--image {
          width: 165px;
        }
      }
    }

    .collection {
      width: 165px;
    }
  }
}
</style>
