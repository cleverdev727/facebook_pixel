<template>
  <div class="flex parent-container">
    <div class="primary-image flex">
      <div
        class="large-screen"
        :style="{ backgroundImage: images.primary.desktop }"
      ></div>
      <div
        class="large-screen-x"
        :style="{ backgroundImage: images.primary.mobile }"
      ></div>
    </div>
    <div
      class="text-container text--light text--center flex"
      :style="{ backgroundColor, color: textColor }"
    >
      <h1 class="main-text large-screen">
        {{ mainTextDesktop }}
      </h1>
      <h1 class="main-text large-screen-x">
        {{ mainTextMobile }}
      </h1>
      <div class="support-text">
        <h3 class="large-screen" v-html="supportTextDesktop"></h3>
        <h3 class="large-screen-x" v-html="supportTextMobile"></h3>
      </div>
      <div class="ctas">
        <div class="primary-cta">
          <nuxt-link
            class="button cta button--white self-auto"
            :to="primaryCta.url"
            >{{ primaryCta.text }}</nuxt-link
          >
        </div>
      </div>
    </div>
    <div
      class="secondary-image large-screen"
      :style="{ backgroundImage: images.secondary.desktop }"
    ></div>
  </div>
</template>

<script>
import heroBannerProps from './commonProps'
export default {
  props: {
    ...heroBannerProps,
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    secondaryDesktopImage: {
      type: Object,
      default: null
    }
  },

  computed: {
    images() {
      return {
        primary: {
          desktop: `url('${this.primaryDesktopImage.url}')`,
          mobile: `url('${this.primaryMobileImage.url}')`
        },
        secondary: {
          desktop: `url('${this.secondaryDesktopImage.url}')`
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/*! purgecss start ignore */
.parent-container {
  > div {
    width: 33.33333333%;
    max-width: 100%;
    min-height: 240px;
  }
}
.text-container {
  padding: 20px 60px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-text {
  margin-bottom: 8px;
}

.primary-image > div,
.secondary-image {
  flex: 1;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 70vh;
}

@media screen and (max-width: $large-screen) {
  .parent-container {
    flex-direction: column;
    > div {
      min-height: 40vh;
      width: 100%;
    }
  }

  .text-container {
    padding: 32px 46px;
    > * {
      max-width: 350px;
    }
  }

  .primary-image {
    > div {
      min-height: auto;
    }
  }
}
/*! purgecss end ignore */
</style>
