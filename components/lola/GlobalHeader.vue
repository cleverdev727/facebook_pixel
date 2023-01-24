<template>
  <header id="app-header" class="app-header">
    <nav class="secondary-nav">
      <ul class="nav-list large-screen">
        <li
          v-for="(link, index) in secondaryMenu"
          :key="`mainListNav${index}`"
          class="nav-item"
        >
          <a
            v-if="link.type === 'External'"
            :href="link.to"
            target="_blank"
            class="nav-link"
          >
            {{ link.title }}
          </a>
          <nuxt-link v-else :to="link.to" class="nav-link">
            {{ link.title }}
          </nuxt-link>
        </li>
      </ul>
      <NavBarPromoText />
    </nav>
    <div class="primary-nav">
      <div class="nav-items">
        <button
          id="nav-trigger"
          type="button"
          class="large-screen-x trigger-btn"
          @click="showSidebar"
        >
          <div class="hamburger-to-x__wrapper">
            <span class="hamburger-to-x__inner"></span>
          </div>
        </button>
        <button
          type="button"
          class="large-screen-x trigger-btn nav-close"
          @click="hideSidebar"
        >
          <close-icon />
        </button>
        <h1
          itemscope=""
          itemtype="http://schema.org/Organization"
          class="site-logo"
        >
          <nuxt-link to="/" class="link">
            <nuxt-img alt="Lola logo" class="fade" src="/lola-logo.svg" />
          </nuxt-link>
        </h1>
        <nav class="app-nav">
          <ul class="nav-list">
            <li
              v-for="(data, index) in menuData"
              :key="`mainNav${index}`"
              class="has-sub-items"
            >
              <nuxt-img
                :src="data.title.icon"
                class="category-img large-screen-x"
                alt="nothingishere"
              />
              <nuxt-link
                v-if="data.type === 'blog'"
                :to="data.title.link"
                class="the-spot fw-md category-title"
                @click.native="handleMobileClick"
              >
                <span>{{ data.title.name }}</span>
                <new-icon-chevron class="icon--chevron large-screen-x" />
              </nuxt-link>
              <a
                v-else
                :href="data.title.link"
                :class="`category-title gtm-nav-${data.title.handle}`"
                @click="handleMobileClick"
              >
                <span>{{ data.title.name }}</span>
                <new-icon-chevron class="icon--chevron large-screen-x" />
              </a>

              <div class="sub-menu-items">
                <ul>
                  <li class="sub-item-header large-screen-x">
                    <div
                      class="back-btn"
                      role="button"
                      title="Go back to main navigation"
                      @click="hideSubMenu"
                    >
                      <new-icon-chevron />
                    </div>
                    <span class="fw-md">
                      {{ data.title.name }}
                    </span>
                  </li>
                  <li
                    v-for="(menu, category, i) in data.subTitle"
                    :key="i"
                    class="sub-item"
                  >
                    <nuxt-link
                      :to="menu.link || data.title.link"
                      @click.native="hideSidebar"
                    >
                      <nuxt-img
                        :src="menu.icon"
                        class="category-img"
                        alt="nothingishere"
                      />
                    </nuxt-link>
                    <span class="text--center"
                      ><nuxt-link
                        :to="menu.link || data.title.link"
                        class="nav-category"
                        @click.native="hideSidebar"
                      >
                        {{ category }}
                      </nuxt-link>
                      <ul class="sub-menu-items-child flex flex--column">
                        <li
                          v-for="(v, ix) in menu.items"
                          :key="`subItem${ix}`"
                          class="sub-item"
                        >
                          <nuxt-link
                            :to="v.to"
                            class="link"
                            @click.native="hideSidebar"
                          >
                            {{ v.title }}
                            <span v-show="v.isNew" class="new">New!</span>
                          </nuxt-link>
                        </li>
                      </ul>
                    </span>
                  </li>
                </ul>
                <nuxt-link
                  v-if="data.type === 'blog'"
                  to="/blog"
                  class="shop-all large-screen"
                >
                  View all
                </nuxt-link>
                <nuxt-link
                  v-else
                  :to="`/collections/#collection-${data.title.handle}`"
                  class="shop-all large-screen"
                >
                  Shop all
                </nuxt-link>
              </div>
            </li>
            <li class="has-sub-items large-screen-x">
              <div class="img-dummy" style="height: 6px"></div>
              <div class="bd"></div>
            </li>
            <li
              v-for="(link, index) in secondaryMenu"
              :key="`mainListNav${index}`"
              class="has-sub-items large-screen-x"
            >
              <div class="img-dummy large-screen-x"></div>
              <a
                v-if="link.type === 'External'"
                :href="link.to"
                target="_blank"
                class="category-title"
              >
                {{ link.title }}
              </a>
              <nuxt-link v-else :to="link.to" class="category-title">
                {{ link.title }}
              </nuxt-link>
            </li>
          </ul>
        </nav>
        <ul class="account-nav flex flex--items-center">
          <li
            class="app-navigation__item app-navigation__item-none app-navigation--desktop-only app-navigation__item--cart"
          >
            <a
              href="#"
              class="app-navigation__link app-navigation__link-border-account search-icon"
              @click.prevent="toggleSearchInput"
            >
              <span>
                <search-icon />
              </span>
            </a>
          </li>

          <li
            v-if="searchInputVisible"
            class="app-navigation__item app-navigation__item-none app-navigation--desktop-only app-navigation__item search"
          >
            <span>
              <search-box
                v-bind="{ searchQuery: globalQuery }"
                class="is-hidden-mobile"
                placeholder="Search for products"
              />
              <search-autocomplete />
            </span>
            <button
              type="button"
              class="large-screen-x trigger-btn nav-close"
              @click="hideSearchbar"
            >
              <close-icon />
            </button>
          </li>

          <li class="app-navigation__item app-navigation__item--cart">
            <nuxt-link
              :to="accountLink"
              class="app-navigation__link gtm-nav-log-in app-navigation__link-border-account account-icon"
            >
              <span>
                <account-icon />
              </span>
            </nuxt-link>
          </li>
          <main-nav-cart />
        </ul>
      </div>
    </div>

    <!-- Cart Flyout -->
    <client-only>
      <cart />
    </client-only>
  </header>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import AccountIcon from '../lola/icons/AccountIcon'
import CloseIcon from '../lola/icons/CloseIcon.vue'
import SearchIcon from '../lola/icons/SearchIcon'
import NewIconChevron from '../lola/icons/NewIconChevron.vue'
import NavBarPromoText from '../nacelle/NavBarPromoText.vue'
import { getBlogCategories } from '~/helpers/blog'
import { getNormalizedFeaturedMedia } from '~/utils/contentful.util'
import { imagePlaceholder } from '~/helpers/general'

export default {
  components: {
    AccountIcon,
    CloseIcon,
    NavBarPromoText,
    NewIconChevron,
    SearchIcon
  },
  data() {
    return {
      accountLink: '/account/login',
      appNav: null,
      appHeader: null,
      blogCategories: []
    }
  },
  async fetch() {
    await this.setRecommendedProducts()
    const { items: categories } = await getBlogCategories(this.$contentful)
    this.blogCategories = categories.map((x) => {
      const { icon, ...category } = x.fields
      if (!icon) return category

      const { url, alt } = getNormalizedFeaturedMedia(icon)
      return { ...category, icon: { alt, url } }
    })
  },
  computed: {
    ...mapState('space', ['id', 'name', 'linklists']),
    ...mapState('search', ['globalQuery', 'searchInputVisible']),
    ...mapState('account', ['customer', 'loginStatus']),
    ...mapGetters('space', ['getLocalizedLinks']),
    hasMembership() {
      return this.customer && this.customer.tags.includes('StoreMember')
    },
    secondaryMenu() {
      return this.getLocalizedLinks('secondary-menu')
    },
    menuData() {
      const periodTampons = this.processMenuList(
        this.getLocalizedLinks('tampons')
      )
      const periodCupPadsLiners = this.processMenuList(
        this.getLocalizedLinks('pads-liners')
      )
      const periodPms = this.processMenuList(this.getLocalizedLinks('pms'))
      const sustainablePeriods = this.processMenuList(
        this.getLocalizedLinks('sustainable-periods')
      )
      const sex = this.processMenuList(this.getLocalizedLinks('sex'))
      const sexExtras = this.processMenuList(
        this.getLocalizedLinks('sex-extras')
      )
      const vaginalHealth = this.processMenuList(
        this.getLocalizedLinks('vaginal-health')
      )
      const hygieneEssentials = this.processMenuList(
        this.getLocalizedLinks('hygiene-essentials')
      )
      const bundles = this.processMenuList(this.getLocalizedLinks('bundles'))
      const kitsGuides = this.processMenuList(
        this.getLocalizedLinks('kits-guides')
      )
      const valuePacks = this.processMenuList(
        this.getLocalizedLinks('value-packs')
      )

      const pregnancyTests = this.processMenuList(
        this.getLocalizedLinks('pregnancy-tests')
      )
      const pregnancySupplements = this.processMenuList(
        this.getLocalizedLinks('pregnancy-supplements')
      )
      const pregnancyExtras = this.processMenuList(
        this.getLocalizedLinks('pregnancy-extras')
      )

      const blogCategories = this.blogCategories.reduce((acc, curr) => {
        const entry = {
          icon: curr.icon?.url || imagePlaceholder,
          items: [],
          link: `/blog/${curr.handle}`
        }

        acc[curr.title] = entry
        return acc
      }, {})

      return [
        {
          title: {
            name: 'Periods',
            handle: 'periods',
            link: '/collections/periods',
            icon: '/icons/lola-period.jpg'
          },
          subTitle: {
            Tampons: { items: periodTampons, icon: '/icons/tampons.jpg' },
            'Pads + Liners': {
              items: periodCupPadsLiners,
              icon: '/icons/pads-liners.jpg'
            },
            'Sustainable Periods': {
              items: sustainablePeriods,
              icon: '/icons/sustainable-period.jpg'
            },
            PMS: { items: periodPms, icon: '/icons/pms.jpg' }
          }
        },
        {
          title: {
            name: 'Sex',
            handle: 'sex',
            link: '/collections/sex',
            icon: '/icons/lola-sex.jpg'
          },
          subTitle: {
            Sex: { items: sex, icon: '/icons/sex.jpg' },
            Extras: { items: sexExtras, icon: '/icons/sex-extras.jpg' }
          }
        },
        {
          title: {
            name: 'Vaginal Health',
            handle: 'vaginal-health',
            link: '/collections/vaginal-health',
            icon: '/icons/vaginal-health.jpg'
          },
          subTitle: {
            'Vaginal Health': {
              items: vaginalHealth,
              icon: '/icons/nav/vaginal-health.jpg'
            },
            'Hygiene Essentials': {
              items: hygieneEssentials,
              icon: '/icons/nav/hygiene-essentials.jpg'
            }
          }
        },
        {
          title: {
            name: 'Pregnancy + Fertility',
            handle: 'pregnancy',
            link: '/collections/pregnancy',
            icon: '/icons/pregnancy.jpg'
          },
          subTitle: {
            Tests: {
              items: pregnancyTests,
              icon: 'icons/nav/tests.jpg'
            },
            Supplements: {
              items: pregnancySupplements,
              icon: 'icons/nav/prenatals.jpg'
            },
            Extras: {
              items: pregnancyExtras,
              icon: 'icons/nav/preg-extras.jpg'
            }
          }
        },
        {
          title: {
            name: 'Popular Sets',
            handle: 'popular-sets',
            link: '/collections/popular-sets',
            icon: '/icons/popular-sets.jpg'
          },
          subTitle: {
            Bundles: { items: bundles, icon: '/icons/nav/bundles.jpg' },
            'Kits + Guides': {
              items: kitsGuides,
              icon: '/icons/nav/kits-guides.jpg'
            },
            'Value Packs': {
              items: valuePacks,
              icon: '/icons/nav/value-packs.jpg'
            }
          }
        },
        {
          title: {
            name: 'The Spot',
            handle: 'blog',
            link: '/blog/',
            icon: '/icons/lola-sex.jpg'
          },
          subTitle: blogCategories,
          type: 'blog'
        }
      ]
    }
  },
  watch: {
    searchInputVisible: {
      immediate: false,
      handler(visible) {
        const doc = window?.document?.body?.parentElement
        if (!doc) return

        if (visible) {
          doc.classList.add('search-open')
        } else {
          doc.classList.remove('search-open')
        }
      }
    },
    $route: {
      immediate: false,
      handler(to, from) {
        if (from.path !== to.path) {
          this.hideSearchbar()
        }
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setBodyTopPadding)
  },
  mounted() {
    this.setBodyTopPadding()
    window.addEventListener('resize', this.setBodyTopPadding)
  },
  methods: {
    ...mapActions('product/recommendations', ['setRecommendedProducts']),
    ...mapMutations('search', [
      'toggleSearchInput',
      'setSearchInputVisible',
      'setQuery'
    ]),
    handleMobileClick(e) {
      const { target } = e
      e.preventDefault()
      const doc = document.body.parentElement
      if (doc.classList.contains('nav-open')) {
        const parent = target.parentElement
        if (parent) {
          parent.classList.add('active')
        }

        return false
      }

      this.unstickNavMenu()
      const path = new URL(target.href).pathname
      this.$router.push({ path })
      return true
    },
    hideSidebar() {
      const doc = document.body.parentElement
      doc.classList.remove('nav-open')
      const activeMenu = document.querySelector('.has-sub-items.active')
      if (activeMenu) {
        activeMenu.classList.remove('active')
      }
    },
    hideSubMenu(e) {
      const parent = e.target.closest('.has-sub-items')
      if (parent) {
        parent.classList.remove('active')
      }
    },
    processMenuList(menu) {
      const mapped = menu.map((items) => {
        const { title, ...rest } = items
        let newTitle = title.trim()
        const isNew = newTitle.endsWith('!')
        if (isNew) {
          newTitle = newTitle.substring(0, newTitle.length - 1)
        }
        return Object.assign(rest, { title: newTitle }, { isNew })
      })
      return mapped
    },
    setBodyTopPadding() {
      const header = document.getElementById('app-header')
      document.body.style.paddingTop = header.offsetHeight + 'px'
    },
    hideSearchbar() {
      this.setQuery({ query: '' })
      this.setSearchInputVisible(false)
    },
    showSidebar() {
      const doc = document.body.parentElement
      doc.classList.add('nav-open')
      this.unstickNavMenu()
    },
    /* As an SPA, the submenus in the fixed
      site navigation remain open on hover
      after a category link has been clicked.
      This class briefly disables pointer
      events on the category links and in
      effect, disables the hover state for
      the clicked link.
     */
    unstickNavMenu() {
      const doc = document.body.parentElement
      doc.classList.add('disable-hover')
      setTimeout(() => {
        doc.classList.remove('disable-hover')
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
#app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 500;
}

.secondary-nav {
  padding: 0 43px;
  height: 34px;
  display: flex;
  justify-content: space-between;
  background-color: $light-terracotta;
  align-items: center;
  font-size: 13px;

  ul {
    display: flex;
    gap: 1.2em;

    li {
      a {
        text-decoration: none;
        line-height: 34px;

        &:hover {
          color: $dark-brown;
          text-decoration: underline;
          font-weight: 400;
        }
      }
    }
  }

  ::v-deep {
    .nav-promo-text {
      font-size: inherit;
    }
  }
}

.primary-nav {
  padding: 8px 0 6px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 16%);

  .nav-items {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    position: relative;
    padding: 0 40px;
  }

  .app-nav {
    display: flex;
    align-items: stretch;
    .nav-list {
      display: flex;
      column-gap: 54px;

      a {
        font-size: 14px;
      }

      .sub-menu-items-child {
        a {
          font-size: 12px;
        }
      }
    }

    .has-sub-items {
      display: flex;
      align-items: center;
      > a {
        text-decoration: none;
      }

      &:hover {
        border-bottom: 2px solid $dark-blue;
        > a {
          color: $dark-blue;
          font-weight: 600;
        }
        .sub-menu-items {
          display: flex;
        }
      }
    }
  }

  .sub-menu-items {
    position: absolute;
    width: 100%;
    left: 0;
    top: 100%;
    display: none;
    flex-direction: column;
    background-color: #fff;
    animation-duration: 200ms;
    animation-play-state: running;
    animation-name: product-nav-fade-in;
    animation-timing-function: ease-out;

    ul {
      display: flex;
      column-gap: 60px;
      justify-content: center;
    }

    > ul {
      padding: 24px 15px;
    }

    .shop-all {
      text-align: center;
      padding: 10px 0;
      line-height: 26px;
      border-top: 1px solid #dcdcdc;
      text-decoration: none;
    }
  }

  li.sub-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    a {
      font-size: 13px;
      line-height: 26px;
      text-decoration: none;

      &:hover {
        font-weight: 600;
      }
    }
  }
}

.new {
  font-size: 8px;
  font-weight: 400;
  color: #fff;
  background: $dark-blue;
  padding: 2px 5px;
  border-radius: 8px;
}

.the-spot {
  color: $dark-blue;
}

@keyframes product-nav-fade-in {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }
}

.site-logo {
  margin: 0;
  line-height: 1;
  font-size: 1rem;
  align-self: center;
}

.account-nav {
  align-items: stretch;
  column-gap: 20px;

  li {
    align-self: center;
  }
}

.nav-category {
  font-weight: bold;
}

.category-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.search-icon {
  cursor: pointer;
}
.mobile-nav-search {
  display: flex;
  align-items: center;
}

.bd {
  width: 29px;
  height: 6px;
  background-color: $dark-brown;
}

.sub-item-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  padding-bottom: 8px;
  border-bottom: 1px solid $grey;

  span {
    width: 100%;
    text-align: center;
    margin-left: -41px;
  }
}

.back-btn {
  display: flex;
  padding-right: 16px;
  padding-left: 10px;
  transform: rotate(180deg);
}

button.trigger-btn {
  background-color: transparent;
  color: $dark-brown;
  width: 30px;
  padding: 0;
  border: none !important;
  align-self: center;
}

.category-title {
  > * {
    pointer-events: none;
  }
}

@media screen and (max-width: ($large-screen - 1px)) {
  .primary-nav {
    padding: 0;
  }
  .secondary-nav {
    height: 36px;
    padding: 10px 16px;
    text-align: center;

    ::v-deep {
      .nav-promo-text {
        flex: 1;
      }
    }
  }

  .nav-items {
    height: 50px;
    padding: 0 16px !important;
    box-shadow: 0 1px 3px rgb(0 0 0 / 16%);
    background: #fff;

    .app-nav {
      background: #fff;
      flex-direction: column;
    }
  }

  .nav-close {
    display: none;
  }

  html.nav-open {
    overflow-y: hidden;
    .nav-list {
      transform: translateX(0);
    }

    .nav-close {
      display: initial;
    }

    #nav-trigger {
      display: none;
    }
  }
  html.search-open {
    .nav-items {
      > :not(.account-nav, .app-nav),
      .account-nav > :not(.search) {
        display: none !important;
      }

      .account-nav {
        flex: 1;
      }

      .search {
        display: flex !important;
        justify-content: space-between;
        flex: 1;

        .trigger-btn {
          display: block !important;
        }

        > span {
          flex: 1;
        }
      }
    }
  }

  .nav-list {
    flex-direction: column;
    overflow-y: auto;
    padding: 0 0 26px;
    display: block;
    position: fixed;
    top: 86px;
    left: 0;
    right: 0;
    width: auto;
    height: calc(100% - 86px);
    background-color: #fff;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(0.01, 0.44, 0.03, 1);
    z-index: -1;
  }

  .category-title {
    font-size: 18px !important;
    font-weight: 400 !important;
    font-family: 'Apercu Medium' !important;
    flex: 1;
    align-items: center;
    display: flex;
  }

  .category-img,
  .img-dummy {
    width: 30px;
    height: 30px;
    margin-right: 16px;
  }

  .icon--chevron {
    margin-left: auto;
  }

  .has-sub-items {
    padding: 0 16px !important;
    border-bottom: none !important;
    margin-top: 26px;

    .sub-menu-items {
      display: none !important;
      ul {
        flex-direction: column;
        row-gap: 16px;
        .sub-item {
          flex-direction: row;
          align-items: flex-start;

          > span {
            flex: 1;
            display: flex;
            flex-direction: column;
            row-gap: 16px;
            text-align: left !important;
          }
        }
      }
    }
    &.active {
      .sub-menu-items {
        display: block !important;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        overflow-y: auto;

        > ul {
          padding: 16px;
          display: block;
          > .sub-item {
            margin-top: 16px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: ($medium-screen - 1px)) {
  .account-nav {
    column-gap: 12px;
  }
}
</style>
