<template>
  <div>
    <div
      class="lola-promo-banner flex flex--items-center justify--center full-width text--center"
      :style="{ backgroundColor }"
    >
      <div v-if="icon" class="icon">
        <img :src="icon.fields.file.url" alt="Promo icon" />
      </div>
      <div ref="promoText" class="promo-text" :style="{ color: copyTextColor }">
        <span v-html="marked.parseInline(copy)"> </span>
      </div>
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
  </div>
</template>

<script>
import marked from 'marked'
import Popup from './Popup.vue'

export default {
  components: { Popup },
  props: {
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    copy: {
      type: String,
      default: ''
    },
    copyTextColor: {
      type: String,
      default: 'inherit'
    },
    icon: {
      type: Object,
      default: null
    },
    popupTextAlignment: {
      type: String,
      default: 'left'
    },
    popupCopy: {
      type: String,
      default: ''
    },
    showPromoBanner: {
      type: String,
      default: 'on'
    }
  },
  data() {
    return {
      marked,
      promoLink: null,
      showPopup: false
    }
  },
  mounted() {
    const el = this.$refs.promoText
    const link = el.querySelector('a')
    this.promoLink = link

    if (!link) return

    link.addEventListener('click', this.handleClick)
  },
  beforeDestroy() {
    if (this.promoLink) {
      this.promoLink.removeEventListener('click', this.handleClick)
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
/*! purgecss start ignore */
.lola-promo-banner {
  padding: 10px;
  margin-top: 10px;

  @media screen and (max-width: $medium-screen) {
    padding: 10px 8px;
    .icon {
      margin-right: 8px;

      img {
        width: auto;
        height: 32px;
      }
    }
  }
}

::v-deep .promo-popup {
  max-width: 400px;
  padding: 0 15px 20px;
}

.icon {
  margin-right: 14px;

  img {
    height: 36px;
    display: block;
  }
}

.promo-text {
  ::v-deep {
    p {
      &:last-of-type {
        margin-bottom: 0;
      }

      a {
        color: inherit;
      }
    }

    a {
      text-decoration: none;
      display: block;
    }
  }
}
/*! purgecss end ignore */
</style>
