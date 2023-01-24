<template>
  <div>
    <article v-if="article" class="article">
      <breadcrumbs :data="breadcrumbs" :last-link-is-clickable="true" />
      <div class="article-hero">
        <div v-if="images" class="show-mobile-only">
          <transition name="fade">
            <nuxt-img
              class="article-hero-img"
              :src="images.mobile.url"
              :alt="images.mobile.altText"
            />
          </transition>
        </div>

        <div v-if="images" class="hide-mobile-only">
          <transition name="fade">
            <nuxt-img
              class="article-hero-img"
              :src="images.desktop.url"
              :alt="images.desktop.altText"
            />
          </transition>
        </div>
      </div>
      <div class="author">
        <span class="author-img" v-html="getAuthorImage(article.author)"></span>
        <span class="author-name">{{ getAuthorName(article.author) }}</span>
      </div>
      <transition name="fadeDelay">
        <div>
          <h1 class="article-header has-text-centered">
            {{ article.title }}
          </h1>
          <section
            v-if="article.excerpt"
            class="article-excerpt"
            v-html="article.excerpt"
          ></section>
          <div class="article-body">
            <div class="content" v-html="article.content" />
          </div>
        </div>
      </transition>
    </article>
    <div v-if="article" class="container mx-auto">
      <div class="relevant-articles mb-4">
        <header>
          <divider />
          <h3 class="text-center text--blue">Relevant Articles</h3>
          <divider />
        </header>
        <div class="articles">
          <article-preview
            v-for="(entry, index) in relatedArticles"
            :key="index"
            :article="entry"
          />
        </div>
      </div>
      <div v-show="showBestsellers" class="best-sellers">
        <header>
          <divider />
          <h3 class="text-center text--blue">Shop best sellers</h3>
          <divider />
        </header>
        <you-might-like
          :handles="bestsellerHandles"
          @loaded="showBestsellers = true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ArticlePreview from '@/components/lola/ArticlePreview.vue'
import Breadcrumbs from '@/components/lola/Breadcrumbs.vue'
import Divider from '@/components/lola/Divider.vue'
import YouMightLike from '@/components/lola/YouMightLike.vue'
import { normalizeImageUrl } from '@/helpers/strings'
import { generateBreadcrumbs } from '@/helpers/page'
import { getFlattenedFeaturedMedia } from '~/utils/contentful.util'
import { buildArticleData } from '~/helpers/blog'
import { removeKeys, addObjectFieldsToParent } from '~/helpers/general'

export default {
  components: {
    ArticlePreview,
    Breadcrumbs,
    Divider,
    YouMightLike
  },
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showBestsellers: false
    }
  },
  computed: {
    bestsellerHandles() {
      return this.article?.bestsellers || []
    },
    breadcrumbs() {
      return generateBreadcrumbs(this.$route, { removeTrailingPath: true })
    },
    images() {
      if (!this.article) return null
      const { featuredImageDesktop, featuredImageMobile, featuredMedia } =
        this.article

      if (!(featuredImageDesktop || featuredMedia)) {
        return null
      }

      let desktopImage

      if (featuredImageDesktop) {
        // fields has the structure -> {file: {url: string}, title: string?, description: string?}
        desktopImage = featuredImageDesktop.fields
      } else {
        const { url, alt } = getFlattenedFeaturedMedia(featuredMedia)
        desktopImage = {
          file: { url },
          description: alt
        }
      }

      let mobileImage = featuredImageMobile?.fields || desktopImage

      desktopImage = {
        altText:
          desktopImage?.description ||
          this.article?.description ||
          this.article.title,
        url: normalizeImageUrl(desktopImage?.file?.url)
      }

      mobileImage = {
        altText:
          mobileImage?.description ||
          this.article?.description ||
          this.article.title,
        url: normalizeImageUrl(mobileImage?.file?.url)
      }

      return {
        desktop: desktopImage,
        mobile: mobileImage
      }
    },
    relatedArticles() {
      return (this.article?.relatedArticles || []).map((x) =>
        buildArticleData(
          // We are going too many levels deep.
          // Remove data that article previews don't need
          // in order to prevent endless recursion.
          removeKeys(addObjectFieldsToParent(x), [
            'bestsellerProducts',
            'relatedArticles'
          ])
        )
      )
    }
  },
  methods: {
    getAuthorImage({ firstName }) {
      const firstInitial = firstName.substr(0, 1)
      return `<span class="author-icon">${firstInitial.toUpperCase()}</span>`
    },
    getAuthorName({ firstName, lastName }) {
      return `${firstName} ${lastName}`
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

.article {
  padding: 10px 15px 40px;
  margin: 0 auto;
  width: 100%;
  max-width: 780px;

  ::v-deep {
    .site-breadcrumbs {
      padding-left: 0;
    }
  }
}

.article-body {
  ::v-deep {
    h1,
    h2,
    h3,
    h4,
    h5 {
      color: $dark-blue;
    }
  }
}

.article-hero-img {
  border-radius: 10px;
  width: 100%;
}

.article-header {
  margin-bottom: 14px;
}

.author {
  display: flex;
  margin-top: 24px;
  margin-bottom: 16px;
  column-gap: 8px;
  align-items: center;

  ::v-deep {
    .author-icon {
      display: flex;
      width: 30px;
      height: 30px;
      align-items: center;
      justify-content: center;
      color: #fff;
      border-radius: 50%;
      background-color: #6e8db1;
    }
  }
}

.article-excerpt,
.article-excerpt p,
.content,
.content p {
  line-height: 26px;
}

.relevant-articles {
  margin-top: 60px;

  .articles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 20px;
  }
}

header {
  display: flex;
  justify-content: space-between;
  column-gap: 24px;
  align-items: center;
  margin-bottom: 24px;
}

::v-deep {
  .you-might-like .header {
    display: none;
  }
}

@media screen and (max-width: ($large-screen - 1px)) {
  .relevant-articles {
    .articles {
      grid-template-columns: repeat(2, 1fr);
      column-gap: 20px;
    }
  }
}

@media screen and (max-width: $medium-screen) {
  .relevant-articles {
    .articles {
      grid-template-columns: repeat(1, 1fr);
      gap: 20px;
    }
  }
}
/*! purgecss end ignore */
</style>
