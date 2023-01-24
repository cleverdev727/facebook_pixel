<template>
  <div class="container mx-auto">
    <section class="bestsellers">
      <header class="flex flex--items-center">
        <h3 class="mb-0">Bestsellers</h3>
        <div class="tabs flex flex--items-center">
          <div
            v-for="tab in bestSellerTabs"
            :key="tab.title"
            class="tab"
            :class="{ active: activeTab === tab.title }"
            @click="switchTab(tab.title)"
          >
            {{ tab.title }}
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
        <product-recommendations
          v-for="tab in bestSellerTabs"
          :key="tab.title"
          :products="tab.products"
          :class="{ active: activeTab === tab.title }"
        />
      </div>
    </section>
  </div>
</template>

<script>
import ProductRecommendations from '@/components/lola/ProductRecommendations.vue'
import recommendationMixin from '@/mixins/recommendations'

export default {
  components: { ProductRecommendations },
  mixins: [recommendationMixin],
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
      activeTab: '',
      bestSellerTabs: []
    }
  },
  async mounted() {
    this.activeTab = this.tabs[0]?.fields.title
    const tabs = this.tabs.map((x) => {
      const { title, products } = x.fields
      const handles = products.map((y) => y.fields.handle.split('::')[0])
      return { title, handles }
    })

    this.bestSellerTabs = tabs

    const handles = tabs.reduce((acc, curr) => {
      acc = [...acc, ...curr.handles]
      return acc
    }, [])

    const allProducts = (await this.getProductsByHandles(handles)).reduce(
      (acc, curr) => {
        acc[curr.handle] = curr
        return acc
      },
      {}
    )

    this.bestSellerTabs = tabs.map(({ title, handles }) => {
      const products = handles.map((handle) => allProducts[handle])
      return { title, products }
    })
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab
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

      &.active {
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
