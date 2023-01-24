<template>
  <div class="page blog-page container mx-auto">
    <breadcrumbs :data="breadcrumbs" :last-link-is-clickable="false" />
    <blog :blog="blog" />
    <p v-if="showEmptyArticlesMessage" class="text--center">
      No articles for this blog yet.
    </p>
    <button
      v-show="showButton"
      class="button button--stripped-blue load-more"
      :disabled="buttonDisabled"
      @click="loadMore"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Blog from '@/components/lola/Blog'
import Breadcrumbs from '@/components/lola/Breadcrumbs'
import { generateBreadcrumbs } from '@/helpers/page'
import { getLatestArticles } from '@/helpers/blog'
import { removeKeys } from '@/helpers/general'
import pageMixin from '@/mixins/page'

export const ARTICLES_LIMIT = 10

export default {
  components: { Blog, Breadcrumbs },
  mixins: [pageMixin],
  data() {
    return {
      blog: null,
      canLoadMore: true,
      fetched: 0,
      loading: false,
      showButton: true
    }
  },
  async fetch() {
    const { blogHandle: handle } = this.$route.params
    this.loading = true
    let blog

    try {
      if (handle === 'latest') {
        blog = { title: 'Latest blog posts', fields: { featuredArticles: [] } }
        const { items: articles, total } = await getLatestArticles(
          this.$contentful,
          {
            excludeHandles: [],
            limit: ARTICLES_LIMIT
          }
        )
        blog.fields.featuredArticles = articles
        this.fetched += articles.length
        if (this.fetched >= total) {
          this.canLoadMore = false
        }
      } else {
        blog = await this.getBlog(handle)
      }
      this.loading = false

      if (blog) {
        const featuredArticles = blog.fields.featuredArticles || []

        // Load more if there are less than 10 featured articles
        const length = featuredArticles.length
        this.blog = blog
        if (length < ARTICLES_LIMIT) {
          const remainder = ARTICLES_LIMIT - length

          await this.loadMore(remainder)
        }

        if (!this.fetched) {
          this.showButton = false
        }
      }
    } catch (error) {
      console.warn(error)
    }
  },
  computed: {
    articleHandles() {
      return this.featuredArticles.map((x) => x.fields.handle)
    },
    breadcrumbs() {
      return generateBreadcrumbs(this.$route)
    },
    buttonDisabled() {
      if (!this.canLoadMore) return true

      return this.loading
    },
    buttonText() {
      if (!this.canLoadMore) return 'No more articles'

      return this.loading ? 'Fetching articles...' : 'Load more'
    },
    featuredArticles() {
      return this.blog?.fields?.featuredArticles || []
    },
    page() {
      // this.page is used by the page mixin to run the head() function
      return this.blog
    },
    showEmptyArticlesMessage() {
      if (this.loading || !this.blog) return false

      return !this.featuredArticles.length
    }
  },
  mounted() {
    this.blogView({ blog: this.blog })
  },
  methods: {
    ...mapActions('blog', ['getBlog', 'getBlogArticles']),
    ...mapActions('events', ['blogView']),
    async loadMore(limit = 10) {
      if (!this.blog) return

      const { blogHandle } = this.$route.params
      const excludeHandles = [...this.articleHandles]

      this.loading = true

      try {
        const { items: articles, total } =
          blogHandle === 'latest'
            ? await getLatestArticles(this.$contentful, {
                excludeHandles,
                limit
              })
            : await this.getBlogArticles({
                blogHandle,
                excludeHandles,
                limit
              })

        if (!articles.length) {
          return false
        }

        this.fetched += articles.length

        const updatedFields = {
          ...this.blog.fields,
          featuredArticles: [
            ...this.featuredArticles,
            ...articles.map((x) => {
              const fields = removeKeys(x.fields, [
                'bestsellerProducts',
                'relatedArticles'
              ])

              x.fields = fields
              return x
            })
          ]
        }

        this.blog = { ...this.blog, fields: updatedFields }

        if (this.fetched >= total) {
          this.canLoadMore = false
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/*! purgecss start ignore */

.blog-page {
  padding: 10px 0;
}

.load-more {
  margin: 72px auto;
  width: 100%;
  max-width: 300px;
}

::v-deep {
  @media screen and (max-width: $medium-screen) {
    .load-more {
      margin-top: 32px;
    }
  }
}
/*! purgecss end ignore */
</style>
