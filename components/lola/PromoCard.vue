<template>
  <li
    v-show="showModule.toLowerCase() === 'on'"
    :class="`collection-promo-container text--${textAlignment}`"
  >
    <div style="position: relative">
      <img
        v-if="promoImage"
        :src="promoImage.fields.file.url"
        :alt="promoImage.fields.description || promoImage.fields.title"
      />
      <section ref="copyContainer" class="copy-container">
        <article
          class="desktop-only"
          v-html="marked(promoCopyDesktop)"
        ></article>
        <article
          class="tablet-only"
          v-html="marked(promoCopyDesktop)"
        ></article>
        <article
          class="mobile-only"
          v-html="marked(promoCopyMobile || promoCopyDesktop)"
        ></article>
      </section>
    </div>
    <popup
      :show="showPopup"
      @close-popup="showPopup = false"
      @modal-clicked="showPopup = false"
    >
      <div class="promo-popup flex flex--items-center justify--center">
        <div class="content flex--column">
          <div
            class="body"
            :class="`text--${popupTextAlignment}`"
            v-html="marked(popupCopy)"
          ></div>
        </div>
      </div>
    </popup>
  </li>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import marked from 'marked'
import Popup from './Popup.vue'

export default {
  components: { Popup },
  props: {
    popupTextAlignment: {
      type: String,
      default: 'left'
    },
    popupCopy: {
      type: String,
      default: ''
    },
    promoCopyDesktop: {
      type: String,
      default: ''
    },
    promoCopyMobile: {
      type: String,
      default: ''
    },
    promoImage: {
      type: Object,
      default: () => {}
    },
    showModule: {
      type: String,
      default: 'off'
    },
    textAlignment: {
      type: String,
      default: 'left'
    }
  },
  data() {
    return {
      documentToHtmlString,
      marked,
      promoLinks: null,
      showPopup: false
    }
  },
  mounted() {
    const el = this.$refs.copyContainer
    const links = el.querySelectorAll('article a')
    this.promoLinks = links

    if (!links.length) return

    links.forEach((link) => link.addEventListener('click', this.handleClick))
  },
  beforeDestroy() {
    if (this.promoLinks?.length) {
      this.promoLinks.forEach((link) =>
        link.removeEventListener('click', this.handleClick)
      )
    }
  },
  methods: {
    handleClick(e) {
      e.preventDefault()
      this.showPopup = true
    }
  }
}
</script>

<style lang="scss" scoped>
.collection-promo-container {
  position: relative;
  grid-area: col-promo;

  .copy-container {
    padding: 15px 20px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  ::v-deep {
    .promo-popup .content {
      max-width: 400px;
      padding: 0 15px 20px;
    }
  }

  @media screen and (max-width: $tablet-screen) {
    font-size: 15px;
    p {
      margin-bottom: 8px;
    }

    .copy-container {
      padding: 10px;
    }
  }
}
</style>
