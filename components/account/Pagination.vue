<template>
  <section class="pagination">
    <nuxt-link
      class="pagination_arrow pagination_arrow--left"
      :class="previousPage ? '' : 'pagination--disabled'"
      :to="`/account/search/${previousPage}?address=${selectedAddress}`"
      >></nuxt-link
    >
    <nuxt-link
      v-for="index in pages"
      :key="index"
      class="pagination_number"
      :class="index === currentPage ? 'pagination--current' : ''"
      :to="`/account/search/${index}?address=${selectedAddress}`"
      >{{ index }}</nuxt-link
    >
    <nuxt-link
      class="pagination_arrow pagination_arrow--right"
      :class="nextPage ? '' : 'pagination--disabled'"
      :to="`/account/search/${nextPage}?address=${selectedAddress}`"
      >></nuxt-link
    >
  </section>
</template>

<script>
export default {
  props: {
    pages: {
      type: Number,
      default: 1
    },
    currentPage: {
      type: Number,
      default: 1
    },
    selectedAddress: {
      type: String,
      default: ''
    }
  },
  computed: {
    nextPage() {
      return this.currentPage < this.pages ? this.currentPage + 1 : null
    },
    previousPage() {
      return this.currentPage > 1 ? this.currentPage - 1 : null
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-bottom: 3em;

  @media (min-width: 600px) {
    justify-content: flex-end;
    margin-right: 3em;
  }

  &_arrow {
    font-size: 15px;
    text-decoration: none;
    padding: 0 6px;
    height: 50%;
    border-radius: 50%;
    background: #dddddd;
    color: #707070;

    &--left {
      margin-right: 2em;
      transform: rotate(180deg);
    }

    &--right {
      margin-left: 2em;
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &_number {
    margin: 0 0.5em;
    color: #707070;
    font-size: 15px;
    text-decoration: none;
  }

  &--current {
    font-weight: bold;
  }
}
</style>
