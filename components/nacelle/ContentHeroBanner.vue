<template>
  <section>
    <div
      :style="{
        backgroundImage: 'url(' + imageUrl + ')'
      }"
      class="hero-section hero-section-desktop flex flex--items-center"
      :class="bannerClasses"
    >
      <div class="container mx-auto">
        <section class="header-block left--align">
          <div class="text-content" :style="{ color: textColor }">
            <h1 class="title-heading mb-0">
              {{ title }}
            </h1>
            <h3>{{ subtitle }}</h3>
          </div>
          <nuxt-link
            :to="ctaUrl"
            class="button cta button--stripped self-auto"
            :data-cta-target="ctaTargetId"
          >
            {{ ctaText }}
          </nuxt-link>
        </section>
      </div>
    </div>
    <div
      :style="{
        backgroundImage: 'url(' + mobileSrc + ')'
      }"
      class="hero-section hero-section-mobile flex flex--items-center"
      :class="bannerClasses"
    >
      <div class="container mx-auto">
        <section class="header-block left--align">
          <div class="text-content" :style="{ color: textColor }">
            <h1 class="title-heading mb-0">
              {{ title }}
            </h1>
            <h3>{{ subtitle }}</h3>
          </div>
          <nuxt-link
            :to="ctaUrl"
            class="button cta button--stripped self-auto"
            :data-cta-target="ctaTargetId"
          >
            {{ ctaText }}
          </nuxt-link>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    featuredMedia: {
      type: Object,
      default: () => ({})
    },
    alignment: {
      type: String,
      default: 'center'
    },
    backgroundAltTag: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium'
    },
    mobileFullHeight: {
      type: Boolean,
      default: false
    },
    mobileCrop: {
      type: Boolean,
      default: true
    },
    mobileBackgroundImage: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    ctaTargetId: {
      type: String,
      default: null
    },
    ctaText: {
      type: String,
      default: ''
    },
    ctaUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    bannerClasses() {
      const mobileHeightClass = this.mobileFullHeight
        ? 'is-mobile-fullheight'
        : ''
      return `is-${this.size} is-align-${this.alignment} ${mobileHeightClass}`
    },
    imageUrl() {
      return this.featuredMedia?.fields?.file?.url
    },
    mobileSrc() {
      return this.mobileBackgroundImage?.fields?.file?.url || this.imageUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-section {
  height: 75vh;
  background-position: center center;
  background-size: cover;

  &-mobile {
    display: none;
  }

  .header-block {
    max-width: 700px;
    color: #514945;

    &.center--align {
      text-align: center;
      margin: 0 auto;

      .cta {
        margin-left: auto;
        margin-right: auto;
      }
    }

    &.right--align {
      text-align: right;
      margin-left: auto;

      .cta {
        margin-left: auto;
      }
    }
  }

  .title-heading p {
    font-size: 56px;
    line-height: 64px;
    margin-bottom: 20px;
  }

  .cta {
    margin-top: 56px;
    background-color: #fff;
    color: inherit;
    width: 255px;

    &:hover {
      background-color: #514945;
      color: #fff !important;
    }
  }
}

@media screen and (max-width: 600px) {
  .hero-section {
    height: 55vh;
    text-align: center;

    &-mobile {
      display: flex;
    }

    &-desktop {
      display: none;
    }

    .header-block {
      padding: 0.5em;
    }

    .cta {
      margin-left: auto;
      margin-right: auto;
      margin-top: 20px;
    }

    .title-heading p {
      font-size: 38px;
      line-height: 50px;
      margin-bottom: 0;
    }
  }
}
</style>
