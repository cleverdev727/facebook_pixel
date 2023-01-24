<template>
  <div class="cart-items nocontent">
    <span class="text--center"
      >Your cart is empty! <br />
      Let’s fix that.</span
    >
    <div class="suggested-products">
      <nuxt-link
        v-for="(collection, index) in collections"
        :key="index"
        class="button button--stripped"
        :to="`/collections/${collection.handle}`"
      >
        {{ `Shop ${collection.title}` }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collections: [
        { title: 'Sexual Wellness', handle: 'sex' },
        { title: 'Periods', handle: 'periods' },
        { title: 'Vaginal Health', handle: 'vaginal-health' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 100px;
  color: $dark-blue;
}

.suggested-products {
  display: flex;
  flex-direction: column;
  row-gap: 18px;
  width: 100%;
  padding: 0 30px;
}

.button {
  height: 50px;
  border-color: $dark-blue;

  &:hover {
    background-color: $dark-blue;
  }
}

@media only screen and (max-width: $medium-screen) {
  .suggested-products {
    padding: 0;
    margin-top: -20px;
  }

  .cart-items > span {
    margin-top: -20px;
  }
}
</style>
