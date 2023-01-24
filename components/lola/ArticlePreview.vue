<template>
  <div class="article-preview">
    <div v-if="article">
      <transition name="fade">
        <nuxt-link :to="articleUrl" class="blog-link full-width">
          <nuxt-img
            v-if="image && image.url"
            class="article-img"
            :src="image.url"
            :alt="image.alt"
          />
        </nuxt-link>
      </transition>
      <nuxt-link class="blog-title" :to="blogUrl">{{ blogName }}</nuxt-link>
      <nuxt-link :to="articleUrl" class="blog-link article-title">
        <h3 class="title">{{ article.title }}</h3>
      </nuxt-link>
      <section class="excerpt" v-html="article.excerpt"></section>
      <nuxt-link
        class="link flex flex--items-center text--blue"
        :to="articleUrl"
      >
        <span>Read the article</span>
        <arrow-right stroke="#4e6282" color="none" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import ArrowRight from '@/components/lola/icons/ArrowRight'
import { normalizeImageUrl } from '@/helpers/strings'
import { getFlattenedFeaturedMedia } from '@/utils/contentful.util'

export default {
  components: { ArrowRight },
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  computed: {
    articleUrl() {
      return `${this.blogUrl}/${this.article?.handle}`
    },
    blogName() {
      return this.article?.blogHandle?.replace('-', ' ')
    },
    blogUrl() {
      return '/blog/' + this.article?.blogHandle?.toLowerCase()
    },
    image() {
      if (!this.article) {
        return {
          url: '',
          alt: ''
        }
      }
      const { featuredMedia, featuredImageDesktop } = this.article
      const media = featuredMedia || featuredImageDesktop

      if (!media) {
        return {
          url: '',
          alt: ''
        }
      }

      const { url, alt } = getFlattenedFeaturedMedia(media)

      return {
        url: normalizeImageUrl(url),
        alt: alt || this.article.title
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-title {
  display: block;
  color: $dark-blue;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  text-decoration: none;
  text-transform: capitalize;
}

.title,
.blog-title {
  margin-bottom: 8px;
}

.link {
  column-gap: 8px;
  margin-top: 24px;
}

.blog-link {
  display: inline-block;
}

.blog-link,
.link {
  text-decoration: none;
}

.article-img {
  height: 18vw;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;

  @media screen and (max-width: ($large-screen - 1px)) {
    height: 30vw;
  }

  @media screen and (max-width: $medium-screen) {
    height: 65vw;
  }
}
</style>
