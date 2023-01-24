<template>
  <div class="articles-list">
    <article-preview
      v-for="(entry, index) in articles"
      :key="index"
      :article="entry"
    />
  </div>
</template>

<script>
import ArticlePreview from './ArticlePreview.vue'

export default {
  components: { ArticlePreview },
  props: {
    articles: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.articles-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px 20px;
}

@media screen and (max-width: ($large-screen - 1px)) {
  .articles-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media screen and (max-width: $medium-screen) {
  .articles-list {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
