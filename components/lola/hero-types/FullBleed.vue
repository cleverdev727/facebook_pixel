<template>
  <nuxt-link class="parent-container full-bleed" :to="primaryCta.url">
    <img
      :src="images.desktop.url"
      :alt="images.desktop.alt"
      class="primary-image large-screen"
    />
    <div
      class="primary-image large-screen-x"
      :style="{ backgroundImage: `url(${images.mobile.url})` }"
    ></div>
    <div class="text-container text--light">
      <div
        class="content"
        :class="['text--' + textAlignment]"
        :style="{ color: textColor }"
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
            <!-- <nuxt-link
              class="button cta button--stripped self-auto"
              :to="primaryCta.url"
              >{{ primaryCta.text }}</nuxt-link
            > -->
            <div class="button cta button--stripped self-auto">
              {{ primaryCta.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import heroBannerProps from './commonProps'
export default {
  props: {
    ...heroBannerProps
  },
  computed: {
    images() {
      return {
        desktop: this.primaryDesktopImage,
        mobile: this.primaryMobileImage
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.parent-container {
  position: relative;
  display: flex;

  .ctas {
    margin-top: 24px !important;
    .button {
      display: inline-flex;
      min-width: 220px;
      max-width: 100%;
      background: #333e54;
      font-weight: bold;
      padding: 25px;
    }
  }
}

img.primary-image {
  width: 100%;
}

.text-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);

  .content {
    padding: 50px 15px;
    z-index: 2;
    width: 100%;
    max-width: 750px;

    &.text--center {
      margin: 0 auto;
      margin-left: 10%;
    }

    &.text--right {
      margin-left: auto;
    }
  }
}

.main-text {
  margin-bottom: 8px;
  font-weight: bold;
}

.support-text {
  width: 90%;
  margin: 0 auto;
}

@media screen and (max-width: $large-screen) {
  .parent-container {
    min-height: 85vh;
  }

  .primary-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
  }

  .text-container {
    position: relative;
    .content {
      padding: 64px 46px;
      text-align: center;
      max-width: 100%;
    }
  }
}

@media screen and (max-width: $medium-screen - 1px) {
  .text-container {
    .content {
      padding: 32px 15px;
    }
  }
}
</style>
