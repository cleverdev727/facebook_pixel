<template>
  <section class="lola-hero-banner">
    <component :is="bannerType" v-bind="componentFields" />
  </section>
</template>

<script>
import Block from '@/components/lola/hero-types/Block.vue'
import FullBleed from '@/components/lola/hero-types/FullBleed.vue'
import MultiImage from '@/components/lola/hero-types/MultiImage.vue'
import { normalizeImageUrl } from '@/helpers/strings'
import { getFlattenedFeaturedMedia } from '@/utils/contentful.util'

export default {
  components: {
    Block,
    FullBleed,
    MultiImage
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    heroType: {
      type: String,
      default: ''
    },
    primaryDesktopImage: {
      type: Object,
      default: null
    },
    primaryMobileImage: {
      type: Object,
      default: null
    },
    secondaryDesktopImage: {
      type: Object,
      default: null
    },
    secondaryMobileImage: {
      type: Object,
      default: null
    },
    blockAlignment: {
      type: String,
      default: 'Left'
    },
    mainTextDesktop: {
      type: String,
      default: ''
    },
    supportTextDesktop: {
      type: String,
      default: ''
    },
    mainTextMobile: {
      type: String,
      default: ''
    },
    supportTextMobile: {
      type: String,
      default: ''
    },
    textAlignment: {
      type: String,
      default: 'Center'
    },
    textColor: {
      type: String,
      default: 'inherit'
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    primaryCtaText: {
      type: String,
      default: ''
    },
    primaryCtaUrl: {
      type: String,
      default: ''
    },
    secondaryCtaText: {
      type: String,
      default: ''
    },
    secondaryCtaUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    bannerType() {
      const heroType = this.heroType.toLowerCase()

      if (heroType === 'block') {
        return 'Block'
      }

      if (heroType === 'full bleed') {
        return 'fullBleed'
      }

      return 'MultiImage'
    },
    componentFields() {
      const primaryDesktopImage = this.primaryDesktopImage
      const primaryMobileImage = this.primaryMobileImage || primaryDesktopImage
      const data = {
        primaryDesktopImage:
          this.extractImagePropAttributes(primaryDesktopImage),
        primaryMobileImage: this.extractImagePropAttributes(primaryMobileImage),
        mainTextDesktop: this.mainTextDesktop,
        supportTextDesktop: this.supportTextDesktop,
        mainTextMobile: this.mainTextMobile || this.mainTextDesktop,
        supportTextMobile: this.supportTextMobile || this.supportTextDesktop,
        primaryCta: {
          text: this.primaryCtaText,
          url: this.primaryCtaUrl
        },
        textAlignment: this.textAlignment?.toLowerCase(),
        textColor: this.textColor
      }
      if (this.bannerType === 'Block') {
        data.blockAlignment = this.blockAlignment?.toLowerCase()

        const secondaryCtaText = this.secondaryCtaText
        const secondaryCtaUrl = this.secondaryCtaUrl

        if (secondaryCtaText && secondaryCtaUrl) {
          data.secondaryCta = {
            text: secondaryCtaText,
            url: secondaryCtaUrl
          }
        }
      }

      if (this.bannerType === 'MultiImage') {
        const secondaryDesktopImage = this.secondaryDesktopImage

        data.secondaryDesktopImage = this.extractImagePropAttributes(
          secondaryDesktopImage
        )
      }

      if (['Block', 'MultiImage'].includes(this.bannerType)) {
        data.backgroundColor = this.backgroundColor
      }

      return data
    }
  },
  methods: {
    // Compose `file url` and `alt` properties from image field object
    extractImagePropAttributes(imageFieldObject) {
      const { url, alt } = getFlattenedFeaturedMedia(imageFieldObject)
      return { alt, url: normalizeImageUrl(url) }
    }
  }
}
</script>

<style lang="scss" scoped>
.lola-hero-banner {
  ::v-deep {
    .ctas {
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
