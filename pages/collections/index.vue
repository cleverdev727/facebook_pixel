<template>
  <div class="collections-page">
    <div v-show="$fetchState.pending" class="global-loader">
      <div class="lds-dual-ring"></div>
    </div>
    <div class="content">
      <section class="top-section flex--column">
        <div class="header">
          <h3 class="header--text">Shop all products</h3>
          <span class="items-count">{{ count }} items</span>
        </div>

        <div v-if="filteredCollections" class="filters flex">
          <div class="filter flex flex--column flex--items-center">
            <nuxt-img
              class="filter__icon"
              src="https://cdn.shopify.com/s/files/1/2568/9396/files/collection-all-icon-img_150x150.png?v=13834714839269935128"
              alt="filter all icon"
              role="button"
              tabindex="0"
              @click.native="smoothScroll('')"
            />
            <span class="filter__text">All</span>
          </div>

          <div
            v-for="collection in filteredCollections"
            :key="collection.id"
            class="filter flex flex--column flex--items-center"
          >
            <nuxt-img
              class="filter__icon"
              :src="getCollectionSrc(collection.featuredMedia)"
              :alt="collection.title"
              role="button"
              :tabindex="0"
              @click.native="smoothScroll(collection.handle)"
            />
            <span class="filter__text"> {{ collection.title }} </span>
          </div>
        </div>
      </section>
      <div v-if="filteredCollections" class="main-section">
        <div
          v-for="(collection, index) in filteredCollections"
          :key="collection.handle"
          :class="'collection ' + collection.handle + ' has-border'"
        >
          <div class="collection--details">
            <h1 class="title header--text">{{ collection.title }}</h1>
          </div>
          <collection-products :products="collection.products">
            <template #promo-card>
              <client-only>
                <promo-card
                  v-if="promoCard && index === 0"
                  v-bind="promoCard"
                />
              </client-only>
            </template>
          </collection-products>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import CollectionProducts from '@/components/lola/CollectionProducts.vue'
import { imagePlaceholder } from '@/helpers/general'
import collectionsModule from '~/store/collections'
import PromoCard from '~/components/lola/PromoCard.vue'

export default {
  components: {
    CollectionProducts,
    PromoCard
  },
  async fetch() {
    const namespace = 'collections'
    if (!this.$store.hasModule(namespace)) {
      this.$store.registerModule(namespace, collectionsModule, {
        preserveState: !!this.$store.state[namespace]
      })
    }

    await this.$store.dispatch(`${namespace}/fetchCollections`)
  },
  computed: {
    ...mapGetters('global', ['globalPromoCardData', 'globalPromoData']),
    ...mapState('collections', ['collections']),
    filteredCollections() {
      return this.collections.filter(
        (collection) => collection.handle !== 'recharge-products'
      )
    },
    count() {
      return (this.filteredCollections || [])
        .map((item) => item.products.length)
        .reduce((a, b) => a + b, 0)
    },
    promoCard() {
      const fields = this.globalPromoCardData?.fields
      return fields
    }
  },
  methods: {
    getShortDescription(data) {
      if ('fields' in data) {
        return data.fields.shortDescription
      }
      return ''
    },
    getCollectionSrc(featuredMedia) {
      return featuredMedia ? featuredMedia.src : imagePlaceholder
    },
    getProductSrc(product) {
      const { media } = product
      if (media.length > 0) {
        return media[0].src
      }
      return imagePlaceholder
    },
    smoothScroll(handle, duration = 300) {
      const topSection = document.querySelector('.top-section')
      const offset = topSection.offsetHeight + 10

      const className = handle ? `.collection.${handle}` : '.collections-page'
      const target = document.querySelector(className)
      let start = null
      const destinationY = target.offsetTop - offset
      const startingY = window.pageYOffset
      const diff = destinationY - startingY
      window.requestAnimationFrame(function step(timestamp) {
        if (!start) {
          start = timestamp
        }
        const time = timestamp - start
        const percent = Math.min(time / duration, 1)
        window.scrollTo(0, startingY + diff * percent)
        if (time < duration) {
          window.requestAnimationFrame(step)
        }
      })
    },
    formatPrice(p) {
      const price = parseFloat(p)
      const displayPrice = price % 1 === 0 ? price : price.toFixed(2)

      return displayPrice
    }
  }
}
</script>

<style lang="scss" scoped>
.collections-page {
  background-color: #fff;

  @mixin header {
    &.is-single {
      margin: 8px 0;
    }
  }

  @mixin note {
    text-align: center;
    color: #4e6282;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  > header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 82px;
    border-bottom: 18px solid #4e6282;
  }

  @keyframes scale-display {
    0% {
      display: block;
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
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

  @keyframes overlay-fade-in {
    0% {
      display: block;
      z-index: inherit;
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes overlay-fade-out {
    0% {
      display: block;
      opacity: 1;
    }

    80% {
      display: block;
      // opacity: 1;
    }

    99% {
      display: block;
      opacity: 0;
    }

    100% {
      opacity: 0;
      z-index: -2000;
    }
  }

  @keyframes expand-popup {
    0% {
      width: 50%;
      opacity: 0;
    }

    100% {
      width: 100%;
      opacity: 1;
    }
  }

  @keyframes dismiss-popup {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  .content {
    width: 82%;
    max-width: 1400px;
    margin: 0 auto;

    .header--text {
      font: Bold 30px/28px 'Apercu Pro';
      font-weight: normal;
      font-family: 'Apercu Medium', sans-serif;
    }

    .top-section {
      display: flex;
      justify-content: space-between;
      top: 15px;
      position: sticky;
      background: #fff;
      padding: 30px 0 15px;
      z-index: 300;
      border-bottom: 1px solid #80808024;

      .header {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;

        &--text {
          &.is-single {
            margin: 0;
          }
        }

        > span {
          padding-right: 15px;
        }
      }

      .filters {
        display: flex;
        padding-top: 30px;
        transition: all 0.3s ease-in-out;
        overflow-x: auto;
        overflow-y: hidden;

        .filter {
          margin-right: 40px;
          cursor: pointer;
          transition: all 0.22s ease-out;

          &:hover {
            transform: scale(1.1);
          }

          &__icon {
            height: 80px;
            width: 80px;
            min-width: 80px;
            object-fit: cover;
            object-position: center;
            border-radius: 50%;
          }

          &__text {
            margin-top: 10px;
          }
        }
      }
    }

    .main-section {
      padding: 30px 0 75px;

      .collection {
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease-in-out;

        &.has-border:not(:first-of-type) {
          padding-top: 20px;
          margin-top: 20px;
          border-top: 1px solid #dcdcdc;
        }

        &.hidden {
          display: none;
          opacity: 0;
        }

        &--details {
          .title {
            padding-top: 40px;
          }

          .description {
            font-size: 16px;
            line-height: 22px;
            margin-bottom: 10px;

            p {
              margin-bottom: 0;
            }
          }

          .fun-fact {
            font-size: 14px;
            line-height: 20px;

            .highlight {
              font-weight: bold;
              padding: 2px 6px;
              background: #f7eeea;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: $tablet-screen) {
    .content {
      .top-section {
        .filters {
          .filter {
            margin-right: 20px;

            &__icon {
              height: 60px;
              width: 60px;
              min-width: 60px;
            }
          }
        }
      }

      .main-section {
        padding-top: 30px;
      }
    }
  }

  @media screen and (max-width: 600px) {
    .content {
      width: 100%;
      margin: 0;
      padding: 0 15px;

      .top-section {
        display: block;
        padding-top: 30px;

        .header {
          &--text {
            font-size: 22px;

            &.is-single {
              margin: 0;
            }
          }

          > span {
            padding: 0px;
            font-size: 12px;
          }
        }

        .filters {
          .filter {
            margin-right: 15px;

            &:hover {
              transform: scale(1.05);
            }
          }
        }
      }

      .main-section {
        padding: 20px 0;

        .collection {
          display: block;

          &--details {
            width: 100%;

            .title {
              line-height: 22px;
              padding-top: 0;
            }
          }
        }
      }
    }
  }
}

.quick-view-component {
  .quick-view-mobile {
    .form-content {
      .footer {
        .features {
          .description {
            ul {
              li::before {
                content: ' ';
                // color: rgba(204, 127, 101, 0.5);
                background-color: $dark-blue;
                border-radius: 50%;
                font-weight: bold;
                display: inline-block;
                width: 6px;
                height: 6px;
                margin-right: 8px;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .product {
    .quick-add-panel {
      display: none !important;
    }

    &--details {
      display: block;
      text-align: center;

      .copy {
        min-height: auto;

        .title {
          font-size: 14px;
        }
      }

      .price {
        font-size: 16px;

        .count {
          display: inline;
        }
      }
    }

    .shop--cta {
      width: 80%;
      display: block;

      a {
        position: relative;
        overflow: hidden;

        .box-message {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          color: $dark-blue;
          transition: all 0.3s ease-in-out;
          transform: translateY(100%);

          &.reveal {
            transform: translateY(0);
          }
        }
      }
    }
  }
}
</style>
