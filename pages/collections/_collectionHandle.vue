<!--
/****
/* For information about creating collections, please refer to:
/*
/* https://docs.getnacelle.com/nuxt/collections.html#adding-content-to-collections-pages
/****
-->
<template>
  <div>
    <div v-show="!collection" class="global-loader">
      <div class="lds-dual-ring"></div>
    </div>
    <div v-if="collection" class="page-collection">
      <section class="content">
        <div class="main-section">
          <div class="collection has-border">
            <div class="collection--details">
              <h1 class="title header--text is-single">
                {{ collection.title }}
              </h1>
              <section class="description">
                <p>
                  {{ collection.description }}
                </p>
              </section>
            </div>
          </div>
          <collection-products :products="collection.products">
            <template #promo-card>
              <client-only>
                <promo-card v-if="promoCard" v-bind="promoCard" />
              </client-only>
            </template>
          </collection-products>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import CollectionProducts from '@/components/lola/CollectionProducts.vue'
import PromoCard from '~/components/lola/PromoCard.vue'
import collectionsModule from '~/store/collections'

export default {
  components: {
    CollectionProducts,
    PromoCard
  },
  async fetch() {
    const handle = this.$route.params.collectionHandle
    const namespace = 'collections'
    if (!this.$store.hasModule(namespace)) {
      this.$store.registerModule(namespace, collectionsModule, {
        preserveState: !!this.$store.state[namespace]
      })
    }
    await this.$store.dispatch(`${namespace}/getCollection`, handle)
  },
  head() {
    if (this.collection) {
      const properties = {}
      const meta = []

      if (this.collection.title) {
        const fullTitle = this.collection.title

        properties.title = fullTitle
        meta.push({
          hid: 'og:title',
          property: 'og:title',
          content: fullTitle
        })
      }

      if (this.collection.description) {
        meta.push({
          hid: 'description',
          name: 'description',
          content: this.collection.description
        })
        meta.push({
          hid: 'og:description',
          property: 'og:description',
          content: this.collection.description
        })
      }

      return {
        ...properties,
        meta
      }
    }
  },
  computed: {
    ...mapGetters('global', ['globalPromoCardData']),
    ...mapState('collections', ['collections']),
    promoCard() {
      const { promoCard } = this.collection
      const fields = promoCard?.fields || this.globalPromoCardData?.fields
      return fields
    },
    collection() {
      const { collectionHandle: handle } = this.$route.params
      const collection = this.collections.find((x) => x.handle === handle)

      return { ...collection }
    }
  },
  methods: {
    getShortDescription(data) {
      if ('fields' in data) {
        return data.fields.shortDescription
      }
      return ''
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
.page-collection {
  background-color: #fff;

  @mixin note {
    text-align: center;
    color: #4e6282;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 24px;
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
        }
      }
    }
  }

  @media screen and (max-width: $tablet-screen) {
    .content {
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

.lds-dual-ring {
  display: flex;
  align-items: center;
  height: 100vh;
  margin: 0 auto;
  text-align: center;
}
</style>
