<template>
  <client-only>
    <section>
      <ul class="product-card-list">
        <li
          v-for="product in products"
          :key="product.handle"
          class="product-card"
        >
          <nuxt-link
            :to="`/account/add/${product.handle}?address=${selectedAddress}`"
            class="product-card__image-link"
          >
            <nuxt-img
              :src="product.media[0].src"
              class="fade"
              :alt="product.title"
            />
          </nuxt-link>
          <h3 class="product-card__title">
            <nuxt-link
              :to="`/account/add/${product.handle}?address=${selectedAddress}`"
              class="product-card__title-link"
              >{{ product.title }}</nuxt-link
            >
          </h3>
          <p
            class="product-card__description"
            v-html="(product.metadata || {}).shortDescription"
          ></p>
          <p class="product-card__description">
            {{ product.priceRange.min | price }}
          </p>
          <p>
            <nuxt-link
              :to="`/account/add/${product.handle}?address=${selectedAddress}`"
              class="button product-card__cta"
              >Shop now</nuxt-link
            >
          </p>
        </li>
      </ul>
    </section>
  </client-only>
</template>

<script>
export default {
  filters: {
    price(v) {
      if (!v) return ''
      const value = parseFloat(v)
      const displayPrice = value % 1 === 0 ? value.toFixed() : value.toFixed(2)
      return `$${displayPrice}`
    }
  },
  props: {
    products: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedAddress: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
$_product-card-list-spacing: 2.5rem;

.product-card-list {
  display: grid;
  grid-column-gap: $gutter--small;
  grid-template-columns: repeat(3, 1fr);

  .product-card {
    padding-bottom: $_product-card-list-spacing;
  }

  @media (max-width: $product-breakpoint--large) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $product-breakpoint--small) {
    grid-template-columns: 1fr;
  }
}

.product-card {
  font-size: $small-font-size;
  text-align: center;
}

.product-card__link {
  color: $base-font-color;
  display: block;
  text-decoration: none;
}

.product-card__image {
  transition: transform $base-duration $base-timing;

  .product-card__link:hover &,
  .product-card__link:focus & {
    transform: scale(1.03);
  }
}

.product-card__title {
  font-size: 1rem;
  line-height: $small-line-height;
}

.product-card__cta {
  color: #fff;
  &:hover {
    color: #3b3b3b;
  }
}

.product-card__cta--small {
  line-height: 32px;
}

.product-card__description {
  font-size: $small-font-size;
  line-height: $large-line-height;
}

.product-card__title,
.product-card__description {
  margin-bottom: 0.1rem;
}
</style>
