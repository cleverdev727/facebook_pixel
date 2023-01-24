<template>
  <div id="page-loyalty">
    <content-hero-banner v-bind="hero" />
    <div class="how-it-works text--center mx-auto">
      <h2 class="fw-md">How it works</h2>
      <p class="fw-md">
        Sign up to become a LOLA Insider, or simply place your first order with
        us. You’ll score points just for being part of our community. It’s
        totally free.
      </p>
      <p class="fw-md">
        Want more? Upgrade to LOLA+ (for $1.66/month)<br />
        to unlock access to exclusive rewards.
      </p>
    </div>
    <div id="m-graph" class="membership-graph">
      <div class="container mx-auto">
        <div class="grid-3 bottom-border gap-m">
          <div></div>
          <div class="flex flex--column flex--items-center">
            <div class="flex justify--center flex--column mb-2 logo-container">
              <nuxt-img src="/lola-logo.svg" alt="LOLA insiders logo" />
              <h2 class="fw-md mb-0">Insiders</h2>
            </div>
            <nuxt-link
              to="/account/login"
              class="button button--stripped mx-auto bt-av mb-2"
            >
              Join us
            </nuxt-link>
            <p class="text--bold">Free!</p>
          </div>
          <div class="flex flex--column flex--items-center">
            <div class="flex justify--center flex--column mb-2 logo-container">
              <nuxt-img src="/lola-plus-logo.svg" alt="LOLA+ logo" />
              <h2 class="fw-md mb-0">Membership</h2>
            </div>
            <nuxt-link
              to="/products/lola-memberships"
              class="button button--stripped mx-auto bt-av mb-2 up-btn"
            >
              Upgrade now
            </nuxt-link>
            <nuxt-link
              to="/products/lola-memberships"
              class="button button--stripped mx-auto bt-av mb-2 mobile-only"
            >
              Sign up
            </nuxt-link>
            <p class="text--bold">$1.66/month</p>
          </div>
        </div>
        <div class="grid-3 bottom-border">
          <div class="flex flex--items-center">
            <span>Earn points when you shop</span>
          </div>
          <div
            class="flex flex--column flex--items-center justify--center grey-point"
          >
            <div class="point"></div>
            <span>1 point per $1</span>
          </div>
          <div
            class="flex flex--column flex--items-center justify--center blue-point"
          >
            <div class="point"></div>
            <span>2 point per $1</span>
          </div>
        </div>
        <div class="grid-3 bottom-border">
          <div class="flex flex--items-center">
            <span>Free standard shipping</span>
          </div>
          <div
            class="flex flex--column flex--items-center justify--center grey-point"
          >
            <div class="point"></div>
            <span>Orders $25+</span>
          </div>
          <div
            class="flex flex--column flex--items-center justify--center blue-point"
          >
            <div class="point"></div>
            <span>Every order</span>
          </div>
        </div>
        <div class="grid-3 bottom-border">
          <div class="flex flex--items-center">
            <span>Extra points every 3rd purchase</span>
          </div>
          <div
            class="flex flex--column flex--items-center justify--center grey-point"
          >
            <div class="point"></div>
            <span>+ 50 points</span>
          </div>
          <div
            class="flex flex--column flex--items-center justify--center blue-point"
          >
            <div class="point"></div>
            <span>+ 75 points</span>
          </div>
        </div>
        <div class="abs-parent">
          <div class="grid-3">
            <div class="flex flex--items-center">
              <span>Birthday gift</span>
            </div>
            <div
              class="flex flex--column flex--items-center justify--center grey-point"
            >
              <div class="point"></div>
              <span>+ 50 points</span>
            </div>
            <div
              class="flex flex--column flex--items-center justify--center blue-point"
            >
              <div class="point"></div>
              <span>+ 50 points</span>
            </div>
          </div>
          <div class="absolute">
            <div class="flex flex--items-center">
              <span class="text--brown text--uppercase mr-2 text--bold">
                ADDITIONAL BENEFITS
              </span>
              <div class="dashed"></div>
            </div>
          </div>
        </div>
        <div class="grid-3 bottom-border">
          <div class="flex flex--items-center">
            <span>5% off select products</span>
          </div>
          <div
            class="flex flex--column flex--items-center justify--center grey-point"
          ></div>
          <div
            class="flex flex--column flex--items-center justify--center blue-point"
          >
            <div class="point"></div>
          </div>
        </div>
        <div class="grid-3 bottom-border">
          <div class="flex flex--items-center">
            <span>1 item donated per purchase</span>
          </div>
          <div
            class="flex flex--column flex--items-center justify--center grey-point"
          ></div>
          <div
            class="flex flex--column flex--items-center justify--center blue-point"
          >
            <div class="point"></div>
          </div>
        </div>
        <div class="grid-3">
          <div class="flex flex--items-center">
            <span>Early access to product launches</span>
          </div>
          <div
            class="flex flex--column flex--items-center justify--center grey-point"
          ></div>
          <div
            class="flex flex--column flex--items-center justify--center blue-point"
          >
            <div class="point"></div>
          </div>
        </div>
      </div>
    </div>
    <refer-friend-static-module>
      <nuxt-link
        to="/account/login"
        class="cta button button--stripped mx-auto"
      >
        Get started
      </nuxt-link>
      <div class="flex justify--center"></div>
    </refer-friend-static-module>
    <campaigns-module />
    <faqs v-if="faqs" v-bind="faqs" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/page'
import faqs from '@/components/lola/FAQs.vue'
import CampaignsModule from '@/components/yotpo/CampaignsModule.vue'
import ReferFriendStaticModule from '@/components/yotpo/ReferFriendStaticModule.vue'

export default {
  components: { CampaignsModule, faqs, ReferFriendStaticModule },
  mixins: [pageMixin],
  data() {
    return {
      page: null
    }
  },
  async fetch() {
    const handle = 'loyalty'
    this.page = await this.$nacelle.data
      .page({
        handle
      })
      .catch(() => {
        console.warn(
          `No page entry with handle '${handle}' found. Please create one in your CMS,`
        )
        return null
      })
  },
  computed: {
    faqs() {
      return this.pageSections.faqs
    },
    hero() {
      return this.pageSections.heroBanner
    },
    pageSections() {
      return (this.page?.sections || []).reduce((acc, curr) => {
        const id = curr.sys.contentType.sys.id
        acc[id] = curr.fields
        return acc
      }, {})
    }
  },
  mounted() {
    const yotpoScript = document.createElement('script')
    yotpoScript.setAttribute(
      'src',
      'https://cdn-widgetsrepository.yotpo.com/v1/loader/930YXJ3rxnfJAazP3wDmAg'
    )
    document.head.appendChild(yotpoScript)
  }
}
</script>

<style lang="scss" scoped>
.grid-3 {
  display: grid;
  position: relative;
  grid-template-columns: repeat(3, 33.333333333%);
  min-height: 132px;
}

.logo-container {
  img {
    height: 32px;
  }
}

.membership-graph {
  margin-top: 56px;
}

.abs-parent {
  position: relative;
  .grid-3 {
    min-height: 175px;
  }
}

.absolute {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}

.point {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #54565a;
  margin-bottom: 20px;
}

.how-it-works {
  max-width: 546px;
  margin-top: 30px;

  p {
    line-height: 26px;
  }
}

.grey-point {
  background-color: #f2f3f6;
}

.blue-point {
  background-color: #e2ebf0;
  .point {
    background-color: #6f8db1;
  }
}

.dashed {
  border-bottom: 2px dashed $terracotta;
  flex: 1;
}

.text--brown {
  color: $terracotta;
}

.bt-av {
  min-width: 170px;
}

.bottom-border {
  border-bottom: 2px solid #999391;
}

@media screen and (max-width: $medium-screen) {
  .up-btn {
    display: none;
  }
  .gap-m {
    column-gap: 0px;
    padding: 0px;

    > * {
      padding: 0 12px;
    }
  }

  .grid-3 {
    > * {
      &:first-of-type {
        padding-left: 8px;
      }

      &:last-of-type {
        padding-right: 8px;
      }
    }
  }

  .absolute {
    padding: 0 8px;
  }

  .logo-container {
    img {
      height: 15px;
    }

    h2 {
      font-size: 20px;
      padding: 0;
    }
  }

  .point {
    width: 18.75px;
    height: 18.75px;
  }

  .bt-av {
    min-width: auto;
    width: 100%;
    font-size: 12px;
    height: 32px;
  }
}
</style>
