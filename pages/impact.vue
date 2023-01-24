<template>
  <div>
    <template v-if="page">
      <div
        class="hero-banner flex flex--items-center full-width justify--center"
        :style="{
          backgroundImage: 'url(' + bannerImage + ')'
        }"
      >
        <h1 class="text--center text--blue fw-md">
          {{ sections.lolaHeroBanner.mainTextDesktop }}
        </h1>
      </div>
      <div v-if="sideBySideContent" class="twin-section">
        <div class="text-content flex flex--items-center flex--justify-center">
          <div>
            <h2 class="title text--bold">{{ sideBySideContent.title }}</h2>
            <div class="content" v-html="html(sideBySideContent.body)"></div>
            <div class="cta">
              <a :href="sideBySideContent.ctaUrl || ''" class="fw-md">{{
                sideBySideContent.ctaText
              }}</a>
            </div>
          </div>
        </div>
        <div>
          <nuxt-img
            class="d-block full-width"
            :src="sideBySideImage.url"
            :alt="sideBySideImage.alt"
          />
        </div>
      </div>
      <div class="infographic">
        <div class="hide-mobile-only full-width">
          <h3 class="text--bold mx-auto full-width text--center">
            Since 2015, LOLA has donated over 7 million products, and counting…
          </h3>
          <img :src="infoImage" />
        </div>
        <div class="show-mobile-only full-width">
          <h3 class="text--bold mx-auto full-width text--center">
            Since 2015, LOLA has donated over 7 million products, and counting…
          </h3>
          <img :src="infoImage" />
        </div>
      </div>
      <div
        class="lola-launch-info callout flex flex--items-center flex--justify-center"
      >
        <div class="content text--white text--center full-width">
          <p class="text--bold">
            We launched LOLA with 100% organic cotton tampons. We’ve since
            expanded our product line to include sustainable period care
            options. We want to continue in this work and be mindful of our
            footprint.
          </p>
        </div>
      </div>
      <div
        v-if="sections.categoryCards"
        class="category-cards-container text--white"
      >
        <h3 class="title text--center fw-md">
          {{ sections.categoryCards.title }}
        </h3>
        <div class="categories grid">
          <div v-for="(card, i) in cards" :key="i" class="pane">
            <a :href="card.link">
              <section
                class="body hide-mobile-only"
                :style="{
                  backgroundImage: 'url(' + card.imageUrl + ')'
                }"
              ></section>
              <nuxt-img
                :src="card.imageUrl"
                :alt="card.title"
                class="show-mobile-only"
              />
            </a>
            <footer>
              <a :href="card.link" class="flex flex--items-baseline">
                <h3 class="collection-title mb-0">{{ card.title }}</h3>
              </a>
            </footer>
          </div>
        </div>
      </div>
      <div
        class="footnote callout flex flex--items-center flex--justify-center"
      >
        <div class="content text--center full-width">
          <p>
            Interested in helping LOLA take care of the earth?<br />Take our
            <a
              target="_blank"
              href="https://survey.alchemer.com/s3/6830823/April-2022-Sustainability-Survey"
              >sustainability survey</a
            >
          </p>
          <p>
            <small
              >As a LOLA Insider, you can earn up to 200 points when you take
              the
              <a
                target="_blank"
                href="https://survey.alchemer.com/s3/6830823/April-2022-Sustainability-Survey"
                >survey</a
              >.</small
            >
          </p>
        </div>
      </div>
    </template>
    <section v-if="false" class="questions-signups">
      <div class="container mx-auto">
        <div class="content">
          <section
            class="questions text--center flex flex--column justify--center"
          >
            <h2 class="text--bold">How can we help?</h2>
            <p>
              We’re here for the tampon questions, delivery troubleshooting, and
              anything else on your mind.
            </p>
            <div class="ctas flex justify--center mx-auto actions">
              <a
                href="https://help.mylola.com/contact/contact-us-HkTue1onH"
                class="button button--stripped button-md"
                >Ask our team</a
              >
              <a
                href="https://help.mylola.com/"
                class="button button--stripped button-md"
                >Explore FAQs</a
              >
            </div>
          </section>
          <div class="divider"></div>
          <section
            class="signup text--center flex flex--column justify--center"
          >
            <h2 class="text--bold">Sign up for 15% off</h2>
            <p>
              Get the latest updates and offers in your inbox, with 15% off your
              first subscription order.
              <a
                href="https://www.mylola.com/pages/disclaimer-first15"
                target="_blank"
                >Details</a
              >
            </p>
            <div class="actions justify--center">
              <form
                id="discount__form"
                method="POST"
                @submit.prevent="processSignUp"
              >
                <input
                  id="signup-email-input"
                  v-model="signUpEmailInput"
                  :disabled="disabled"
                  type="email"
                  name="email"
                  placeholder="name@email.com"
                  required
                />
                <span class="placeholder flex flex--items-center">
                  <button class="button">
                    <span class="lds-dual-ring" style="display: none"></span>
                    <span class="text">Enter</span>
                  </button>
                </span>
              </form>
              <span
                class="sub-success-message flex flex--items-baseline"
                style="display: none"
              >
                <span>You’re in! Use this code at checkout:</span>
                <h2 class="discount-code text--bold">FIRST15</h2>
              </span>
            </div>
          </section>
        </div>
      </div>
    </section>
    <nacelle-page-placeholder
      v-if="this.$fetchState.pending === false && page === null"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { normalizeImageUrl } from '@/helpers/strings'
import pageMixin from '@/mixins/page'
import { getFlattenedFeaturedMedia } from '~/utils/contentful.util'

export default {
  mixins: [pageMixin],
  scrollToTop: false,
  data() {
    return {
      infoImage:
        'https://images.ctfassets.net/acnkdcy3dwsy/7IJ4a0Im6IJT6JBWyqjmM7/579e4fb224d8bed51362aa7d1c40d152/giveback_infographic.png',
      page: null,
      disabled: false,
      signUpEmailInput: ''
    }
  },
  async fetch() {
    const page = await this.$nacelle.data
      .page({
        handle: 'impact'
      })
      .catch(() => {
        console.warn(
          `No page entry with handle 'impact' found. Please create one in your CMS,`
        )
        return null
      })

    this.page = page
  },
  computed: {
    bannerImage() {
      if (!this.sections?.lolaHeroBanner) return ''

      const { primaryDesktopImage } = this.sections.lolaHeroBanner
      const url = normalizeImageUrl(primaryDesktopImage?.fields?.file?.url)
      return url
    },
    cards() {
      if (!this.sections) return []

      return this.sections.categoryCards.cards.map((card) => {
        const { collectionHandle, featuredImage, title, url } = card.fields
        const link = collectionHandle ? `/collections/${collectionHandle}` : url
        const imageUrl = normalizeImageUrl(featuredImage?.fields?.file?.url)

        return { featuredImage, imageUrl, link, title }
      })
    },
    sections() {
      if (!this.page) return null

      const { sections } = this.page

      return sections.reduce((acc, curr) => {
        const id = curr.sys.contentType.sys.id
        const fields = curr.fields

        if (acc[id]) {
          acc[id] = [acc[id]]
          acc[id].push(fields)
        } else acc[id] = fields

        return acc
      }, {})
    },
    sideBySideContent() {
      if (!this.sections?.sideBySideContent) return null

      return this.sections.sideBySideContent
    },
    sideBySideImage() {
      if (!this.sections?.sideBySideContent) return ''

      const { url, alt } = getFlattenedFeaturedMedia(
        this.sections.sideBySideContent.image
      )
      return { alt, url: normalizeImageUrl(url) }
    }
  },
  mounted() {
    if (this.$route.query) {
      if ('cart' in this.$route.query) {
        setTimeout(() => {
          this.showCart()
        }, 3000)
      }
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    html(content) {
      const html = documentToHtmlString(content)
      return html
    },
    processSignUp() {
      const email = this.signUpEmailInput
      window._iaq.push(['identify', email, { email }])
      this.signUpEmailInput = ''
      this.disabled = true
    }
  }
}
</script>
<style lang="scss" scoped>
.questions-signups {
  background-color: #f8f6f2;
  padding: 36px 0 5px;

  @mixin placeholder {
    font-size: 14px;
    color: #6e8db1;
    font-weight: 500;
  }

  .content {
    margin: 0;
    display: flex;
    justify-content: space-around;
    padding-bottom: 40px;
    border-bottom: 1px solid $dark-brown;
  }

  section {
    width: 450px;
    max-width: 100%;

    h2 {
      margin-bottom: 14px;
    }
  }

  .ctas {
    max-width: 100%;

    .button {
      padding-top: 0;
      padding-bottom: 0;
      height: 40px;
      margin-right: 20px;
    }

    .button:last-child {
      margin-right: 0;
    }
  }

  .actions {
    padding-top: 20px;
  }

  .divider {
    width: 2px;
    background-color: $dark-brown;
  }

  .signup {
    form {
      width: 100%;
      position: relative;

      input {
        height: 48px;
        padding-left: 26px;
        padding-right: 60px;
        border-radius: 40px;
        border: 1px solid $dark-brown;

        &::placeholder {
          @include placeholder;
        }
      }

      .placeholder {
        font-size: 14px;
        position: absolute;
        top: 0;
        right: 24px;
        bottom: 0;

        button {
          border: none;
          background-color: transparent;
          color: inherit;

          &:hover {
            background-color: #5149451a;
          }
        }
      }
    }

    .actions {
      .lds-dual-ring {
        width: auto !important;
        height: auto !important;
      }

      .discount-code {
        padding-left: 10px;
        color: #6e8db1;
      }
    }
  }

  .questions,
  .signup {
    padding-left: 16px;
    padding-right: 16px;
  }

  .signup .actions .lds-dual-ring {
    width: auto !important;
    height: auto !important;
  }

  .signup .actions .lds-dual-ring:after {
    width: 24px;
    height: 24px;
    border-width: 3px;
  }

  #signup-email-input:focus {
    box-shadow: none;
  }

  @media screen and (max-width: $medium-screen) {
    .content {
      flex-direction: column;
      align-items: center;

      .questions {
        padding: 0 16px;

        p {
          font-size: 15px;
        }
      }

      .divider {
        width: 100%;
        height: 1.5px;
        margin: 65px 0;
      }

      .signup {
        padding: 0 16px;

        .sub-success-message {
          flex-direction: column;
          align-items: center;
        }
      }
    }

    .actions {
      justify-content: space-between;
    }
  }
}

.infographic {
  img {
    display: block;
  }

  h3 {
    left: 0;
    position: absolute;
    right: 0;
    padding: calc(6vw * 0.9) 24px;
  }

  .show-mobile-only {
    h3 {
      padding: 5vw 15px;
      font-size: 13px;
      line-height: 1.2;
    }
  }
}

.hero-banner {
  padding: 15px;
  background-size: cover;
  background-position: bottom left;
  min-height: 25vw;
}

.twin-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  .title {
    margin-bottom: 20px;
  }

  .text-content {
    background-color: #9cb8d5;
    padding: 15px 80px;
    line-height: 2;
    color: #1d283a;

    a {
      color: inherit;
    }
  }
}

.lola-launch-info {
  font-size: 18px;
  background-color: #5d8e91;
}

.category-cards-container {
  padding: 40px 0;
  background-color: #7ca7ad;

  .categories {
    padding: 30px;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    a {
      text-decoration: none;
      color: inherit;
    }

    .pane {
      .body {
        display: flex;
        height: 31vw;
        padding: 20px;
        background-size: cover;
        background-repeat: no-repeat;

        &:hover {
          opacity: 0.6;
        }
      }

      img {
        width: 100%;
      }

      footer {
        padding: 12px 15px 12px 0;

        a {
          text-decoration: none;
        }
      }

      .collection-title {
        margin-right: 24px;
      }
    }
  }
}

.footnote {
  background-color: #aac6c9;
}

.callout {
  padding: 5vw 20vw;
  font-size: 24px;

  p {
    font-size: 24px;
  }
}

@media screen and (max-width: $large-screen - 1px) {
  .twin-section {
    display: flex;
    flex-direction: column;
  }

  .infographic {
    h3 {
      padding: calc(6vw * 0.6) 24px;
    }
  }
}

@media screen and (max-width: $tablet-screen) {
  .callout {
    padding: 5vw 16vw;
  }
}

@media screen and (max-width: $medium-screen) {
  .category-cards-container {
    .categories {
      display: block;
      margin-top: 60px;
      padding: 0 16px;

      .pane {
        .body {
          height: auto;
        }

        footer {
          justify-content: space-between;
          margin-bottom: 36px;
        }
      }
    }
  }

  .callout {
    padding: 5vw 15vw;
  }
}

@media screen and (max-width: $small-screen) {
  .hero-banner {
    padding: 20px 50px;
    background: bottom center;
  }

  .twin-section {
    .text-content {
      padding: 30px;
    }
  }
}
</style>
