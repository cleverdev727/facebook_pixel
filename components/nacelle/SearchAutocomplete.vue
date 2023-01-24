<template>
  <transition name="fade-up">
    <div v-show="autocompleteVisible" ref="autocomplete" class="autocomplete">
      <h4>Search Results</h4>
      <search-results :search-query="globalQuery">
        <template #result="{ result }">
          <search-autocomplete-item
            v-for="item in result"
            :key="item.id"
            :item="item"
          />
        </template>
        <template #loading>
          <span>Loading product catalog...</span>
        </template>
        <template #no-results>
          <search-no-results />
        </template>
      </search-results>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('search', ['globalQuery']),
    autocompleteVisible() {
      return !!this.globalQuery
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleDocumentClick)
  },
  mounted() {
    document.addEventListener('click', this.handleDocumentClick)
  },
  methods: {
    ...mapMutations('search', ['setQuery']),
    handleDocumentClick(e) {
      const { target } = e
      const closest = target.closest('.account-nav .search .autocomplete')
      const autocomplete = this.$refs.autocomplete

      if (closest !== autocomplete) {
        this.setQuery({ query: '' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.autocomplete {
  position: absolute;
  z-index: 9999;
  right: 1rem;
  width: 30rem;
  overflow: scroll;
  height: 30rem;
  border: 1px solid #514945;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: -1px 4px 7px 0px rgba(0, 0, 0, 0.08);
  top: calc(100% + 10px);
  background-color: #fff;

  @media screen and (max-width: $large-screen - 1px) {
    right: 0;
    left: 0;
    width: 94%;
    margin: -15px 13px 0 13px;
    top: calc(100% + 20px);
  }
}

h4 {
  text-align: left;
  letter-spacing: 1px;
  margin-bottom: 1em;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-up-enter, .fade-up-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(20px);
}
</style>
