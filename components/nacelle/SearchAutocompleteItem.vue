<template>
  <nuxt-link :to="`${pathFragment}${item.handle}`" class="search-link">
    <div class="search-results">
      <div>
        <nuxt-img
          v-if="productThumbnail"
          :src="productThumbnail"
          width="60"
          height="60"
          class="autocomplete-thumb"
        />
      </div>
      <div class="product-sec">
        <div class="product-title">{{ item.title }}</div>
        <div class="product__body">
          <p>
            <span>
              {{ stripTags(item.description) }}
            </span>
          </p>
        </div>
      </div>
      <div>
        <product-price v-if="productPriceProps" v-bind="productPriceProps" />
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import { normalizeImageUrl } from '~/helpers/strings'
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    pathFragment() {
      // customize this as needed to route to different `searchDataTypes` listed in nuxt.config.js
      const typePathMap = {
        article: '/blog/',
        blog: '',
        page: '/pages/',
        default: '/products/'
      }

      let base = typePathMap[this.item.type] || typePathMap.default
      if (this.item.type === 'article') {
        base += `${this.item.blogHandle}/`
      }

      return base
    },
    productThumbnail() {
      return normalizeImageUrl(
        this.item?.featuredMedia?.thumbnailSrc ||
          this.item?.fields?.featuredImageDesktop?.file?.url
      )
    },
    productPriceProps() {
      const variant = this.item?.variants?.[0]
      if (variant && variant.price && variant.priceCurrency) {
        return {
          price: variant.price,
          currencyCode: variant.priceCurrency
        }
      }
      return null
    }
  },
  methods: {
    stripTags(content) {
      if (content == null) {
        return ''
      }
      return content.replace(/(<([^>]+)>)/gi, '')
    }
  }
}
</script>
<style lang="scss" scoped>
.autocomplete-thumb {
  min-width: 80px;
  height: auto;
}
.search-link {
  &:hover {
    color: #514945;
  }
}
.search-results {
  display: flex;
  margin-bottom: 1em;
  .product-sec {
    margin: 0 1em;
    .product-title {
      font-weight: bold;
      margin-bottom: 0.5em;
    }
  }
  a {
    text-decoration: none;
  }
}
</style>
