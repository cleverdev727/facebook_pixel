<!--
/****
/* Customize your Nacelle content by taking advantage
/* of named slots. For more details, refer to:
/*
/* https://docs.getnacelle.com/nuxt/pages.html#customizing-homepage-content-output
/****
-->
<template>
  <div class="page article-page">
    <div v-if="loading" class="cart__loader">
      <div class="lds-dual-ring"></div>
    </div>
    <div v-else>
      <blog-article :article="article" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import pageMixin from '@/mixins/page'
import { buildArticleData } from '@/helpers/blog'
import BlogArticle from '~/components/lola/BlogArticle.vue'

export default {
  components: {
    BlogArticle
  },
  mixins: [pageMixin],
  data() {
    return {
      article: null,
      loading: true
    }
  },
  async fetch() {
    const { articleHandle, blogHandle } = this.$route?.params
    const article = await this.$nacelle.data
      .article({
        handle: articleHandle,
        blogHandle: blogHandle?.toLowerCase()
      })
      .catch(() =>
        console.warn(`Article with handle: '${articleHandle}' not found`)
      )

    this.loading = false

    if (article) {
      this.article = buildArticleData(article)
    }
  },
  computed: {
    ...mapGetters('space', ['getMetatag']),
    page() {
      // this.page is used by the page mixin to run the head() function
      return this.article
    }
  },
  mounted() {
    this.articleView({ article: this.article })
  },
  methods: {
    ...mapActions('events', ['articleView'])
  }
}
</script>

<style lang="scss" scoped>
/*! purgecss start ignore */

.article-page {
  margin-bottom: 40px;
}
/*! purgecss end ignore */
</style>
