<template>
  <span class="search" :class="`${position}-searchbox`">
    <search-input
      :placeholder="placeholder"
      :position="position"
      :search-query="searchQuery"
      @update="updateQuery"
      @submit="navigateToSearchResults"
    />
  </span>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    position: {
      type: String,
      default: 'global'
    },
    searchQuery: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Search'
    }
  },
  methods: {
    ...mapMutations('menu', ['disableMenu']),
    ...mapMutations('search', ['setQuery']),
    updateQuery(query) {
      this.setQuery({ query, position: this.position })

      if (this.position === 'page') {
        const routeQuery = this.$route.query
        const newRouteQuery = { ...routeQuery, q: query }

        if (JSON.stringify(routeQuery) !== JSON.stringify(newRouteQuery)) {
          this.$router.replace({ query: newRouteQuery })
        }
      }
    },
    navigateToSearchResults(query) {
      const q = query || ''

      if (this.position === 'global') {
        this.disableMenu()
        this.$router.push({ path: '/search', query: { q } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  position: relative;
}
</style>
