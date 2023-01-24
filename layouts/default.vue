<template>
  <lazy-hydrate when-idle class="app nacelle">
    <div>
      <yotpo-integration />
      <global-header />
      <div v-show="loading" class="global-loader">
        <loader />
      </div>
      <cart-notification />
      <nuxt keep-alive :keep-alive-props="{ max: 5 }" />
      <site-footer />
      <event-dispatcher />
      <error-modal />
      <cart-watch />
      <quick-view />
    </div>
  </lazy-hydrate>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LazyHydrate from 'vue-lazy-hydration'
import globalModule from '@/store/global'
import YotpoIntegration from '@/components/yotpo/YotpoIntegration.vue'
import QuickView from '@/components/lola/QuickView.vue'
import CartNotification from '@/components/lola/CartNotification.vue'
import Loader from '~/components/lola/Loader.vue'
import { smoothScroll } from '~/lib/utils'

export default {
  components: {
    CartNotification,
    LazyHydrate,
    Loader,
    QuickView,
    YotpoIntegration
  },
  async fetch() {
    const namespace = 'global'
    if (!this.$store.hasModule(namespace)) {
      this.$store.registerModule(namespace, globalModule, {
        preserveState: !!this.$store.state[namespace]
      })
    }

    await Promise.all([
      this.$store.dispatch(`${namespace}/getPromoBanner`),
      this.$store.dispatch(`${namespace}/getGlobalPromoCard`)
    ])
  },
  head() {
    const properties = {}
    const meta = []
    const title = this.getMetatag('title')
    const description = this.getMetatag('description')
    const image = this.getMetatag('og:image')

    if (title) {
      properties.title = title.value
      meta.push({
        hid: 'og:title',
        property: 'og:title',
        content: title.value
      })
      meta.push({
        hid: 'og:site_name',
        property: 'og:site_name',
        content: title.value
      })
    }

    if (description) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: description.value
      })
      meta.push({
        hid: 'og:description',
        property: 'og:description',
        content: description.value
      })
    }

    if (image) {
      meta.push({
        hid: 'og:image',
        property: 'og:image',
        content: image.value
      })
    }

    meta.push({
      hid: 'og:type',
      property: 'og:type',
      content: 'website'
    })

    return {
      ...properties,
      meta
    }
  },
  computed: {
    ...mapGetters('space', ['getMetatag']),
    ...mapGetters('global', ['loading'])
  },
  async mounted() {
    await this.initializeCheckout()
    await this.initializeCart()
    await this.clearProductIdb()
    this.getSearchData()
    this.readSession()

    document.addEventListener('click', this.handleLinkClick)
  },
  methods: {
    ...mapActions(['clearProductIdb']),
    ...mapActions('cart', ['initializeCart']),
    ...mapActions('checkout', ['initializeCheckout']),
    ...mapActions('user', ['readSession']),
    ...mapActions('search', ['getSearchData']),
    handleLinkClick(e) {
      const target = e.target
      const targetElementId = target.getAttribute('data-cta-target')
      if (targetElementId) {
        e.preventDefault()
        const element = document.getElementById(targetElementId)
        if (!element) return false
        const topSection = document.getElementById('app-header')
        const offset = topSection.offsetHeight + 10
        smoothScroll(element, { offset })
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.cart {
  z-index: 9999;
  background: white;
}

html {
  font-family: 'Apercu Pro', Calibri, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.1s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
</style>
