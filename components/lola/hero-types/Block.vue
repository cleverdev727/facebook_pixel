<template>
  <div
    class="flex"
    :class="[blockAlignment === 'left' ? 'left-block' : 'right-block']"
  >
    <div
      class="text-container text--light"
      :class="['text--' + textAlignment, 'flex--items-' + flexAlignment]"
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
        <div v-if="primaryCta.text && primaryCta.url" class="primary-cta">
          <nuxt-link
            class="button cta button--white self-auto"
            :to="primaryCta.url"
            >{{ primaryCta.text }}</nuxt-link
          >
        </div>
        <div v-if="secondaryCta" class="secondary-cta">
          <nuxt-link
            class="button cta button--white self-auto"
            :to="secondaryCta.url"
            >{{ secondaryCta.text }}</nuxt-link
          >
        </div>
      </div>
    </div>
    <div
      class="primary-image large-screen"
      :style="{ backgroundImage: images.desktop }"
    >
      <div v-if="primaryCta.url" class="overlay-button-wrapper">
        <nuxt-link class="overlay-button" :to="primaryCta.url"></nuxt-link>
      </div>
      <div v-if="secondaryCta" class="overlay-button-wrapper">
        <nuxt-link class="overlay-button" :to="secondaryCta.url"></nuxt-link>
      </div>
    </div>
    <div
      class="primary-image large-screen-x"
      :style="{ backgroundImage: images.mobile }"
    >
      <div v-if="primaryCta.url" class="overlay-button-wrapper">
        <nuxt-link class="overlay-button" :to="primaryCta.url"></nuxt-link>
      </div>
      <div v-if="secondaryCta" class="overlay-button-wrapper">
        <nuxt-link class="overlay-button" :to="secondaryCta.url"></nuxt-link>
      </div>
    </div>
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
    blockAlignment: {
      type: String,
      default: 'left'
    },
    secondaryCta: {
      type: Object,
      default: null
    }
  },
  computed: {
    flexAlignment() {
      if (this.textAlignment === 'left') return 'start'
      if (this.textAlignment === 'right') return 'end'
      return 'center'
    },
    images() {
      return {
        desktop: `url('${this.primaryDesktopImage.url}')`,
        mobile: `url('${this.primaryMobileImage.url}')`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-container {
  padding: 20px 60px;
  width: 33.3333333%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-text {
  margin-bottom: 8px;
}

.primary-image {
  flex: 1;
  background-position: center center;
  background-size: cover;
  min-height: 70vh;
  background-repeat: no-repeat;
  width: 66.6666666%;
  position: relative;
}
.primary-image .overlay-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  color: transparent;
}

.right-block {
  flex-direction: row-reverse;
}

@media screen and (max-width: $large-screen) {
  .left-block,
  .right-block {
    flex-direction: column-reverse !important;
  }

  .text-container {
    padding: 40px;
    width: 100%;
    text-align: center;
  }

  .primary-image {
    width: 100%;
    min-height: 40vh;
  }
}
</style>
