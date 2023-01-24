<template>
  <div class="account">
    <account-header />
    <section class="account__content">
      <div class="top-section">
        <h2 class="top-section_title">Shop all products</h2>
        <p class="top-section_description">
          Add new products to your subscription or swap out your current
          product. Get what you need, on your schedule.
        </p>
      </div>
      <div class="search">
        <span class="search-input">
          <search-icon />
          <input
            v-model="searchTerm"
            placeholder="Search by product name or category"
          />
        </span>
        <p v-if="noResults" class="no-results">
          <strong>Oops... there are no search results for these!</strong> Try
          another search or look through the products below.
        </p>
      </div>
      <account-products
        :products="currentProducts"
        :selected-address="selectedAddress"
      />
      <pagination
        :pages="pages"
        :current-page="currentPage"
        :selected-address="selectedAddress"
      />
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchIcon from '@/components/lola/icons/SearchIcon'
import collectionsModule from '~/store/collections'

export default {
  name: 'AccountSearch',
  fetckKey: 'account-search',
  components: {
    SearchIcon
  },
  middleware: 'authenticated',
  data() {
    return {
      searchTerm: ''
    }
  },
  async fetch() {
    const namespace = 'collections'
    if (!this.$store.hasModule(namespace)) {
      this.$store.registerModule(namespace, collectionsModule, {
        preserveState: !!this.$store.state[namespace]
      })
    }
    await Promise.all([
      this.$store.dispatch(`${namespace}/fetchCollections`),
      this.$store.dispatch(`${namespace}/getCollection`, 'recharge-products')
    ])
  },
  computed: {
    ...mapState('collections', ['collections']),
    rechargeProducts() {
      const recharge = this.collections.find(
        (x) => x.handle === 'recharge-products'
      )
      const recharge_ = { ...recharge }
      if ('products' in recharge_) {
        return recharge_.products
      }
      return []
    },
    pages() {
      return Math.ceil(this.rechargeProducts.length / 18)
    },
    currentPage() {
      return parseInt(this.$route.params.pageHandle)
    },
    selectedAddress() {
      return this.$route.query?.address
    },
    currentProducts() {
      const page = this.currentPage
      const pageProducts = this.rechargeProducts.slice(
        (page - 1) * 18,
        page * 18
      )
      return [...new Set([...this.searchResults, ...pageProducts])]
    },
    searchResults() {
      if (!this.searchTerm) return []
      const productMatches = this.rechargeProducts.filter((product) =>
        product.title?.toLowerCase().includes(this.searchTerm.toLowerCase())
      )

      const categoryMatches = this.collections.filter((collection) =>
        collection.title?.toLowerCase().includes(this.searchTerm.toLowerCase())
      )

      if (!categoryMatches.length) return productMatches

      // Using this to prevent duplicate products in the search results
      const found = {}

      const results = [
        ...productMatches,
        ...categoryMatches.map((category) => category.products)
      ]
        .flat()
        .filter((product) => {
          if (found[product.handle]) return false

          found[product.handle] = true
          return true
        })

      return results
    },
    noResults() {
      return this.searchTerm && this.searchResults.length < 1
    }
  }
}
</script>

<style lang="scss" scoped>
.top-section {
  margin: 0 1em;
}

.search {
  display: flex;
  flex-flow: column;

  .search-input {
    margin: 0 1em;
    display: flex;
    align-items: center;

    @media (min-width: 600px) {
      width: 40%;
    }

    input {
      margin-left: 1em;
      border: none;
      border-bottom: 1px solid;

      &:focus {
        box-shadow: none;
      }
    }
  }

  .no-results {
    margin-left: 2.8em;
    margin-top: 1.2em;
  }
}
</style>
