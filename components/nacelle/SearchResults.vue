<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="internalState === 'loading'" key="loading">
        <slot name="loading" />
      </div>

      <div
        v-if="internalState === 'results'"
        key="results"
        class="search-results"
      >
        <slot name="result" :result="globalResultsWithoutDuplicates" />
      </div>

      <div
        v-if="internalState === 'no-results'"
        key="no-results"
        class="no-results"
      >
        <slot name="no-results" />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    searchQuery: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      internalState: 'initial'
    }
  },
  computed: {
    ...mapState('search', ['isLoading', 'globalResults']),
    globalResultsWithoutDuplicates() {
      const resultsObj = this.globalResults.reduce((acc, curr) => {
        const { handle, type, blogHandle } = curr
        if (!(type === 'article' && !blogHandle)) {
          acc[handle] = curr
        }

        return acc
      }, {})

      return Object.values(resultsObj)
    }
  },
  watch: {
    isLoading() {
      this.internalState = 'loading'
    },
    globalResults() {
      if (this.globalResults.length === 0) {
        this.internalState = 'no-results'
      } else {
        this.internalState = 'results'
      }
    },
    searchQuery(newVal) {
      if (newVal && String(newVal) !== '') {
        this.searchCatalog({ value: newVal, position: 'global' })
      }
    }
  },
  methods: {
    ...mapActions('search', ['searchCatalog'])
  }
}
</script>

<style lang="scss" scoped>
.search-results,
.no-results {
  min-height: 400px;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
