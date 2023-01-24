<template>
  <div class="page">
    <div v-if="!loadingPage">
      <page-content :page="page" />
      <nacelle-page-placeholder
        v-if="$fetchState && $fetchState.pending === false && page === null"
      />
    </div>
    <div v-else class="page-loading">
      <div class="lds-dual-ring"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import pageMixin from '@/mixins/page'

export default {
  mixins: [pageMixin],
  async asyncData({ $nacelle, params }) {
    const { pageHandle: handle } = params
    const page = await $nacelle.data.page({ handle }).catch(() => {
      console.warn(`No page with handle: '${handle}' found`)
      return null
    })

    return { page, loadingPage: false }
  },
  data() {
    return {
      page: null,
      loadingPage: true
    }
  },
  async fetch() {
    const { pageHandle: handle } = this.$route.params
    this.page = await this.$nacelle.data.page({ handle }).catch(() => {
      console.warn(`No page with handle: '${handle}' found`)
      return null
    })
    this.loadingPage = false
  },
  fetchOnServer: false,

  computed: {
    ...mapGetters('space', ['getMetatag'])
  },
  mounted() {
    this.pageView({
      path: this.$route.path
    })
  },
  methods: {
    ...mapActions('events', ['pageView'])
  }
}
</script>
