<template>
  <div :id="targetId" class="side-by-side">
    <div class="showcase" :class="showcaseClases">
      <div class="big">
        <template v-if="image">
          <nuxt-img
            :src="sanitizeImageUrl(image.fields.file.url)"
            :alt="title"
          />
        </template>
        <template v-if="videoUrl">
          <div class="v-parent" :style="videoParentStyle">
            <div class="video-container">
              <iframe
                class="eduframe"
                :src="videoUrl"
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
                frameborder="0"
              >
              </iframe>
            </div>
          </div>
          <a
            v-if="ctaText && ctaUrl"
            :href="ctaUrl"
            class="button cta self-auto mobile-only"
            style="margin-top: 30px"
            >{{ ctaText }}</a
          >
        </template>
      </div>
      <div class="content flex flex--column text--center">
        <h2 v-if="title">{{ title }}</h2>
        <div v-html="documentToHtmlString(body)"></div>
        <a
          v-if="ctaText && ctaUrl"
          :href="ctaUrl"
          class="button cta self-auto"
          :class="{ 'desktop-only': videoUrl }"
          >{{ ctaText }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import commonMixins from '~/mixins/commonMixins'
export default {
  mixins: [commonMixins],
  props: {
    body: {
      type: Object,
      required: true
    },
    ctaText: {
      type: String,
      default: null
    },
    ctaUrl: {
      type: String,
      default: null
    },
    image: {
      type: Object,
      default: null
    },
    targetId: {
      type: String,
      default: null
    },
    textPosition: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    videoBackgroundImage: {
      type: Object,
      default: null
    },
    videoUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      documentToHtmlString
    }
  },
  computed: {
    showcaseClases() {
      if (this.textPosition.toLowerCase() !== 'right') {
        return 'reverse'
      }

      return 'reverse-mobile'
    },
    videoParentStyle() {
      const { videoUrl, videoBackgroundImage } = this
      if (videoUrl && videoBackgroundImage) {
        return `background-image: url(${videoBackgroundImage.fields.file.url})`
      }

      return ''
    }
  }
}
</script>
