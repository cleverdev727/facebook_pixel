<template>
  <div class="article-collection">
    <articles-list v-if="articlesList" :articles="articlesList" />
  </div>
</template>

<script>
import ArticlesList from '@/components/lola/ArticlesList.vue'
import { addObjectFieldsToParent } from '~/helpers/general'

export default {
  components: { ArticlesList },
  props: {
    articles: {
      type: Array,
      default: null
    }
  },
  computed: {
    articlesList() {
      if (!this.articles) return null
      return this.articles.map((x) => addObjectFieldsToParent(x))
    }
  }
}
</script>

<style lang="scss" scoped>
.article-collection {
  ::v-deep {
    .articles-list {
      .article-preview {
        .blog-title {
          display: none;
        }
      }

      @media screen and (max-width: $medium-screen) {
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        overflow-x: auto;
        display: flex;

        .article-preview {
          min-width: 300px;
          scroll-snap-align: start;

          .blog-title {
            display: none;
          }
        }
      }
    }
  }
}
</style>
