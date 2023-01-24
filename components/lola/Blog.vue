<template>
  <div v-if="blog" class="container mx-auto blog-container">
    <header>
      <h2 class="text--blue">{{ blog.title }}</h2>
    </header>
    <section v-if="data.tags" class="blog-tags flex" role="tablist">
      <div
        v-for="(tag, i) in data.tags"
        :key="i"
        class="tag text--blue"
        :aria-selected="activeTab === tag"
        :class="{ active: activeTab === tag }"
        role="tab"
        :aria-controls="`panel-${tag}`"
        @click="setActiveTab(tag)"
      >
        {{ tag.replace('-', ' ') }}
      </div>
    </section>
    <hr />
    <transition-group v-if="data.articles" tag="div" class="panels-list">
      <div
        v-for="(articlesList, tab, i) in data.articles"
        v-show="activeTab === tab"
        :id="`panel-${tab}`"
        :key="tab + i"
        class="panel"
      >
        <articles-list :articles="articlesList" />
      </div>
    </transition-group>
  </div>
</template>

<script>
import ArticlesList from '@/components/lola/ArticlesList'
import { buildArticlesAndTags } from '~/utils/contentful.util'

export default {
  components: { ArticlesList },
  props: {
    blog: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      activeTab: 'all'
    }
  },
  computed: {
    data() {
      if (!this.blog) {
        return {}
      }
      const featuredArticles = this.blog?.fields.featuredArticles || []
      const { articles, tags } = buildArticlesAndTags(
        featuredArticles.map((x) => {
          const { fields, ...rest } = x
          return { ...rest, ...fields }
        })
      )
      return {
        articles,
        tags
      }
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab
    }
  }
}
</script>

<style lang="scss" scoped>
/*! purgecss start ignore */
.fade-enter-active {
  transition: opacity 0.25s;
}
.fade-enter {
  opacity: 0;
}

.fadeDelay-enter-active {
  transition: opacity 0.55s 0.25s;
}
.fadeDelay-enter {
  opacity: 0;
}

header {
  margin-top: 24px;
}

.panels-list {
  margin: 32px 0;
}

.blog-tags {
  margin-bottom: 42px;
  column-gap: 32px;
  overflow-x: auto;

  .tag {
    padding: 8px 0;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    text-transform: capitalize;
    flex: 0 0 auto;
    overflow-x: auto;

    &.active {
      border-bottom: 3px solid $dark-blue;
    }
  }
}

::v-deep {
  a.blog-title {
    display: none;
  }

  a.article-title {
    margin-top: 18px;
  }

  @media screen and (max-width: $medium-screen) {
    .blog-tags {
      margin-bottom: 30px;
    }
  }
}
/*! purgecss end ignore */
</style>
