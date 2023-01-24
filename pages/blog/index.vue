<template>
  <div class="page">
    <page-content :page="page" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import pageMixin from '@/mixins/page'

export default {
  name: 'BlogIndex',
  mixins: [pageMixin],
  data() {
    return {
      page: null
    }
  },
  async fetch() {
    try {
      const { $contentful } = this
      const handle = 'blog-landing-page'
      const { items } = await $contentful.getEntries({
        content_type: 'page',
        'fields.handle[match]': handle,
        limit: 1,
        include: 3
      })

      const [page] = items

      if (!page) {
        console.warn('Page with handle: ' + handle + ' not found.')
        return
      }

      this.page = page.fields
    } catch (error) {
      console.error(error)
    }
  },
  mounted() {
    this.pageView({ path: this.$route.path })
  },
  methods: {
    ...mapActions('events', ['pageView'])
  }
}
</script>
