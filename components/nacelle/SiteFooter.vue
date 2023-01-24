<template>
  <div id="shopify-section-footer" class="shopify-section">
    <footer class="app-footer">
      <div class="app-footer__container">
        <ul class="app-footer__list">
          <li v-for="(data, index) in menuData" :key="index">
            <div class="app-footer__head">
              <p class="app-footer__heading">
                {{ data.title }}
              </p>
              <icon-chevron-down
                classz="inline-icon--chevron app-footer__chevron"
              />
            </div>
            <nav>
              <ul>
                <li
                  v-for="(link, i) in data.urls"
                  :key="`list${i}`"
                  class="app-navigation__secondary-item"
                >
                  <a
                    v-if="link.type === 'External'"
                    :href="link.to"
                    target="_blank"
                    class="app-footer__link"
                  >
                    {{ link.title }}
                  </a>
                  <a
                    v-else-if="link.to === '/jobs'"
                    :href="link.to"
                    class="app-footer__link"
                  >
                    {{ link.title }}
                  </a>
                  <nuxt-link v-else :to="link.to" class="app-footer__link">
                    {{ link.title }}
                  </nuxt-link>
                </li>
              </ul>
            </nav>
          </li>
          <li class="app-footer__list-item">
            <p
              id="app-footer-form-trigger"
              class="app-footer__heading-social"
              @click="signup"
            >
              {{ contact_header }}
            </p>
            <nav>
              <ul class="app-footer__social-links">
                <li>
                  <a
                    href="https://www.facebook.com/lola"
                    target="_blank"
                    class="app-footer__social-link gtm-footer-facebook"
                  >
                    <facebook />
                  </a>
                  <a
                    href="https://www.instagram.com/lola/"
                    target="_blank"
                    class="app-footer__social-link gtm-footer-instagram"
                  >
                    <instagram />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCmaHekPbzqPaLGk4k_kwA2g"
                    target="_blank"
                    class="app-footer__social-link gtm-footer-youtube"
                  >
                    <youtube />
                  </a>
                  <a
                    href="https://twitter.com/mylolatweet"
                    target="_blank"
                    class="app-footer__social-link gtm-footer-twitter"
                  >
                    <twitter />
                  </a>
                </li>
              </ul>
            </nav>
          </li>
        </ul>
        <ul class="app-footer__list app-footer__border-faint">
          <div class="app-footer__list-group">
            <li class="app-footer__sub-menu-item">
              <nuxt-link
                to="/privacy"
                class="app-footer__link gtm-footer-privacy"
                :title="privacy"
              >
                {{ privacy }}
              </nuxt-link>
            </li>
            <li class="app-footer__sub-menu-item">
              <nuxt-link
                to="/terms-conditions"
                class="app-footer__link gtm-footer-terms"
                :title="terms"
              >
                {{ terms }}
              </nuxt-link>
            </li>
            <li class="app-footer__sub-menu-item">
              <nuxt-link to="/sitemap" class="app-footer__link">{{
                sitemap
              }}</nuxt-link>
            </li>
          </div>
          <li class="app-footer__sub-menu-item">
            &copy; ALYK {{ currentYear }}. {{ copyright }}
          </li>
        </ul>
      </div>
      <div ref="stayInTouch" class="stay-in-touch">
        <div v-show="display" class="cart__loader">
          <div class="lds-dual-ring"></div>
        </div>
        <div class="flex flex--column text--center mx-auto">
          <header class="text--bold">Stay in touch</header>
          <span class="copy">
            Sign up to get updates, launch announcements, and exclusive offers
            from LOLA.
          </span>
          <form
            method="POST"
            class="home-newsletter-subscription"
            @submit.prevent="processNewsletter"
          >
            <label for="email"><strong>Email</strong> (required)</label>
            <input
              v-model="subEmail"
              type="email"
              name="email"
              required
              placeholder="name@email.com"
              class="text--center"
            />
            <label for="phone_number"><strong>Phone</strong> (optional)</label>
            <input
              v-model="subPhone"
              type="tel"
              name="phone_number"
              placeholder="000-000-0000"
              pattern="[0-9]{3}(-{1,1})?[0-9]{3}((-{1,1})?[0-9]{4})?"
              class="text--center"
            />
            <button
              class="button button--stripped button-md mx-auto subscribe"
              type="submit"
              :disabled="disabled"
            >
              Subscribe
            </button>
            <button
              class="cancel text--underline mx-auto"
              @click="hideNewsletterForm"
            >
              No thanks
            </button>
          </form>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Facebook from '../lola/icons/Facebook'
import Twitter from '../lola/icons/Twitter'
import Youtube from '../lola/icons/Youtube'
import Instagram from '../lola/icons/Instagram'
import IconChevronDown from '../lola/icons/IconChevronDown.vue'
export default {
  components: { Facebook, Twitter, Youtube, Instagram, IconChevronDown },
  data() {
    return {
      copyright: 'All rights reserved.',
      contact_header: 'Stay in touch',
      disabled: false,
      display: false,
      privacy: 'Privacy Policy',
      sitemap: 'Site Map',
      subEmail: '',
      subPhone: '',
      terms: 'Terms & Conditions'
    }
  },
  computed: {
    ...mapGetters('space', ['getLocalizedLinks']),
    ...mapState('account', ['customer']),
    menuData() {
      const about = this.getLocalizedLinks('footer-about')
      const community = this.getLocalizedLinks('footer-community')
      const support = this.getLocalizedLinks('footer-support')

      return [
        {
          title: 'Support',
          urls: support
        },
        {
          title: 'Community',
          urls: community
        },
        {
          title: 'About',
          urls: about
        }
      ]
    },
    currentYear() {
      return new Date().getFullYear()
    }
  },
  mounted() {
    /* Copyright Iterable */
    // eslint-disable-next-line
    (function(){var account,identify,iterableAnalytics,post,push,track,trackPurchase,updateCart;iterableAnalytics={},post=function(endpoint,data,callback){var xhr;return xhr=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),xhr.onreadystatechange=function(){var status;return 4===xhr.readyState&&(status=xhr.status,callback)?callback(status,200===status?JSON.parse(xhr.responseText):xhr.responseText):void 0},xhr.open("POST",iterableAnalytics.baseUrl+endpoint,!0),xhr.setRequestHeader("Content-Type","application/json"),xhr.setRequestHeader("Api-Key",iterableAnalytics.apiKey),xhr.send(JSON.stringify(data))},account=function(apiKey,baseUrl){return iterableAnalytics.apiKey=apiKey,iterableAnalytics.baseUrl=baseUrl||"https://api.iterable.com"},identify=function(email,data,callback){return iterableAnalytics.user={email:email,data:data||{}},0!==Object.keys(data).length?post("/api/users/update",{email:email,dataFields:data},callback):void 0},track=function(eventName,data,callback){return null!=iterableAnalytics.user?post("/api/events/track",{email:iterableAnalytics.user.email,eventName:eventName,dataFields:data},callback):void 0},updateCart=function(items,callback){return null!=iterableAnalytics.user?post("/api/commerce/updateCart",{user:{email:iterableAnalytics.user.email},items:items||[]},callback):void 0},trackPurchase=function(total,items,dataFields,campaignId,callback){var data;return null!=iterableAnalytics.user?(data={user:{email:iterableAnalytics.user.email},items:items||[],total:total,dataFields:dataFields},null!=campaignId&&(data.campaignId=campaignId),post("/api/commerce/trackPurchase",data,callback)):void 0},push=function(cmd){var args,func,funcName;return funcName=cmd[0],func=iterableAnalytics[funcName],null!=func?(args=cmd.slice(1),func.apply(this,args)):void 0},iterableAnalytics.account=account,iterableAnalytics.identify=identify,iterableAnalytics.track=track,iterableAnalytics.updateCart=updateCart,iterableAnalytics.trackPurchase=trackPurchase,iterableAnalytics.push=push,iterableAnalytics.isIAQ=!0,window.iterableAnalytics=iterableAnalytics,null!=window._iaq?null==window._iaq.isIAQ&&(window._iaq.map(function(cmd){return iterableAnalytics.push(cmd)}),window._iaq=iterableAnalytics):window._iaq=iterableAnalytics}).call(this);
    window._iaq.push(['account', this.$config.iterableApiKey])
    if (this.customer && this.customer.email) {
      window._iaq.push(['identify', this.customer.email, {}])
    }

    const element = document.querySelector('.app-footer')
    const arrows = (this.arrows = element.querySelectorAll(
      '.app-footer__chevron'
    ))

    Array.from(arrows).forEach((arrow) => {
      let open = true
      arrow.addEventListener('click', () => {
        const listItems =
          arrow.parentElement.parentElement.querySelectorAll(
            '.app-footer__link'
          )

        if (open) {
          arrow.style.transform = 'rotate(180deg)'
          Array.from(listItems).map((ele) =>
            ele.classList.add('app-footer--show')
          )
        } else {
          arrow.style.transform = 'rotate(0deg)'
          Array.from(listItems).map((ele) =>
            ele.classList.remove('app-footer--show')
          )
        }

        open = !open
      })
    })

    // Kustomer
    const Kustomer = window.Kustomer
    Kustomer?.start()
  },
  methods: {
    signup() {
      this.showNewsletterForm()
    },
    showNewsletterForm() {
      this.$refs.stayInTouch.classList.add('visible')
    },
    hideNewsletterForm() {
      this.$refs.stayInTouch.classList.remove('visible')
    },
    processNewsletter() {
      this.display = true
      this.disabled = true
      window._iaq.push([
        'identify',
        this.subEmail,
        { phone: this.subPhone },
        () => {
          this.subEmail = ''
          this.subPhone = ''
          this.display = false
          this.disabled = false
          this.$refs.stayInTouch.classList.remove('visible')
        }
      ])
    }
  }
}
</script>
<style lang="scss" scoped>
@import '/assets/scss/base/mixins/_containers.scss';
.app-footer {
  background-color: $secondary-background-color;
  padding-bottom: 1rem;
  position: relative;
  text-align: center;
  z-index: $z-index-app-footer;

  @mixin placeholder {
    font-size: 14px;
    color: #6e8db1;
    font-weight: 500;
  }

  .stay-in-touch {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 6px solid #6e8db1;
    background-color: #fff;
    padding: 26px 0;
    z-index: 9999;
    box-shadow: 0 -5px 14px 2px #00000014;
    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    transform: translateY(100%);

    &.visible {
      transform: translateY(0);
    }

    > div {
      width: 360px;
      max-width: 100%;
    }

    header {
      font-size: 28px;
      margin-bottom: 12px;
    }

    .copy {
      font-size: 14px;
      margin-bottom: 28px;
    }

    label {
      text-transform: none;
    }

    input {
      border: 0;
      box-shadow: none;
      border-bottom: 1px solid #dcdcdc;
      margin-bottom: 45px;

      &::placeholder {
        @include placeholder;
        text-align: center;
      }

      &:focus {
        border-color: $action-color;
      }
    }

    .subscribe {
      margin-bottom: 24px;
    }

    .cancel {
      background: none;
      border: none !important;
      color: inherit;
    }

    .cart__loader {
      margin: 0 auto;
    }
  }
}

.app-footer__container {
  @include max-width-container;
}

.app-footer__list {
  text-align: left;

  @media (min-width: $medium-screen) {
    margin-left: 2em;
    padding-top: 2em;
    display: flex;
    justify-content: space-between;
    max-height: 16em;

    @supports (display: grid) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }
}

.app-footer__list-item {
  font-size: $small-font-size;
  border-bottom: 1px solid #dcdcdc;
  padding: 0 0.5em;

  @media (min-width: $medium-screen) {
    margin-bottom: 5rem;
    border-bottom: none;
    padding: 0;
  }
}

.app-footer__head {
  display: flex;
  justify-content: space-between;

  @media (min-width: $medium-screen) {
    display: inherit;
  }
}

.app-footer__heading {
  display: inline-block;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  color: #4e6282;
  margin: 0;
  padding: 1em 0;
}

.app-footer__chevron {
  display: inline-block;
  height: 3.7em;

  @media (min-width: $medium-screen) {
    display: none;
  }
}

.app-footer__heading-social {
  text-decoration: underline;
  font-size: 14px;
  font-weight: bold;
  padding-top: 1em;
  margin-bottom: 1em;
  cursor: pointer;
}

.app-footer__link {
  color: inherit;
  margin-bottom: 1rem;
  text-decoration: none;
  font-size: 14px;
  display: none;

  @media (min-width: $medium-screen) {
    display: inherit;
  }

  &:hover,
  &:focus {
    color: $action-color-alt;
  }
}

.app-footer--show {
  display: inline-block;
}

.app-footer__sub-menu-item {
  font-size: 14px;
  margin: 1em 0;

  @media (min-width: $medium-screen) {
    display: inline-block;
    margin: 0;
  }

  .app-footer__link {
    display: inherit;
  }

  &:last-child {
    width: 12em;

    @media (min-width: $medium-screen) {
      width: inherit;
    }
  }
}

.app-footer__social-links {
  padding-bottom: 1em;
}

.app-footer__social-link {
  color: inherit;
  fill: currentColor;
  margin-right: 0.75em;
  text-decoration: none;

  &:hover,
  &:focus {
    color: $action-color-alt;
  }
}

.app-footer__social-icon {
  height: 20px;
  width: 20px;
}

.app-footer__border-faint {
  display: flex;
  align-items: space-between;

  @media (min-width: $medium-screen) {
    display: grid;
    grid-template-columns: 3fr 1fr;
    row-gap: 0;
    border-top: 1px solid #dcdcdc;
    padding-top: 2em;
  }
}

.app-footer__list-group {
  @media (min-width: $medium-screen) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.app-footer-popup {
  background: #fff;
  border-top: 5px solid #6e8db1;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: none;

  &--slide-up {
    animation-name: slide-up;
    animation-duration: 0.25s;
  }

  @keyframes slide-up {
    0% {
      bottom: -50em;
    }
    100% {
      bottom: 0;
    }
  }

  &__container {
    max-width: 22em;
    margin: auto;
    padding-top: 2em;
  }

  &__header {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 0.2em;
  }

  &__body {
    font-size: 14px;
  }

  &__form {
    margin: 3em 0;
  }

  &__label {
    font-size: 12px;
    text-transform: none;
    margin: auto;
    padding-bottom: 0.5em;

    strong {
      font-size: 14px;
    }
  }

  &__form-item {
    width: 94%;
    display: inline-block;
    border-bottom: 1px solid #dcdcdc;
  }

  &__form-input {
    color: #6e8db1;
    font-weight: bold;
    font-size: 15px;
    display: inline-block;
    width: 69%;
    margin: 0;
    padding-left: 5em;
    border: 0;

    &:focus {
      box-shadow: none;
    }
  }

  &__warning {
    font-size: 12px;
    color: #d11414;
    font-weight: bold;
    display: inline-block;
    margin: 0;
    margin-left: 1.5em;
    visibility: hidden;
  }

  &__button {
    font-size: 15px;
    color: #514945;
    background: #fff;
    border: 1px solid #514945;
    margin: auto;
    padding: 0 6em;

    &:hover,
    &:focus {
      color: #fff;
      background: #514945;
    }
  }

  &__cancel {
    cursor: pointer;
    font-size: 15px;
    text-decoration: underline;
    padding: 2em 0;

    &:hover,
    &:focus {
      font-weight: bold;
    }
  }
}
button {
  cursor: pointer;
}
</style>
