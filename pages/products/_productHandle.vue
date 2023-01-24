<!--
/****
/* For instructions related to connecting your inventory to
/* Nacelle, please refer to:
/*
/* https://docs.getnacelle.com/getting-started.html#_2-product-settings
/****
-->
<template>
  <div class="lola-pdp">
    <div v-if="!productLoading">
      <div
        v-if="product"
        id="lola-product-page"
        :class="{ 'has-gift-card': isGiftCard }"
      >
        <section id="product-main" class="product__main">
          <div class="breadcrumbs---images" :style="{ top: topOffset }">
            <breadcrumbs
              v-if="hasBreadcrumbs"
              :data="product.metadata.breadcrumbs"
            />
            <product-media-desktop
              :media="productMedia"
              :product-name="product.title"
            />
            <product-media-mobile
              :media="productMedia"
              :product-name="product.title"
            />
          </div>
          <section class="product__main--details">
            <section class="heading">
              <h1 class="title">
                {{ product.title }}
              </h1>
            </section>
            <section class="info">
              <span v-if="hasQuantityInfo" class="count">{{
                product.metadata.quantityInfo
              }}</span>
              <small
                v-if="!(hasSubscriptionId || isGiftCard) || isMembershipProduct"
                >for</small
              >
              <small v-else>starting at</small>
              <span
                :class="{ 'count--strike': isMember && membershipDiscount }"
                >{{ startingAtPrice }}</span
              >
              <span v-if="isMember && membershipDiscount">{{
                compareAtPrice
              }}</span>
              <star-rating v-show="showStars" :product="product" />
            </section>
            <promo-strip
              v-if="promoData && promoData.showPromoBanner !== 'off'"
              v-bind="promoData"
            />
            <section v-if="product.description" class="description">
              <div class="product__body" v-html="product.description" />
            </section>
            <section class="promo-banner-pdp hide-elem">
              <div />
            </section>
            <div
              v-show="productLoading"
              class="flex flex--items-center justify--center mb-2"
            >
              <loader />
            </div>
            <single-product
              :product="product"
              @ready="pdpIsReady"
              @subscription-update="updateSubscriptionType"
            />
            <div
              v-if="isEligibleForMembership && !isMembershipProduct"
              class="upsell-product"
            >
              <upsell-product-form
                v-if="product.metadata.upsellProduct"
                :form-product="product.metadata.upsellProduct"
              />
            </div>
            <div class="cart-btn-section">
              <div class="qty">
                <select
                  v-model="quantity"
                  :disabled="product.metadata.isValuePack"
                >
                  <option v-for="index in 6" :key="index" :value="index">
                    {{ index }}
                  </option>
                </select>
                <div class="dropdown-toggle">
                  <icon-chevron-down classz="inline-icon--chevron" />
                </div>
              </div>
              <product-add-to-cart-button
                :subscription-type="subscriptionType"
                :cart-is-full="cartIsFull"
                :product="product"
                :quantity="quantity"
                :variant="selectedVariant"
                :prepaid-product="product__"
                :upsell-product="product.metadata.upsellProduct"
                :disabled="productLoading"
                :subscription="subscription"
                :is-recharge-add="isRechargeAdd"
                :is-recharge-edit="isRechargeEdit"
              />
            </div>
            <div class="cart-btn-section">
              <div style="display: none" class="gwbutton button gift-btn">
                Send as a Gift
              </div>
            </div>
            <div v-if="outOfStock(product)" class="notification-form">
              <h4 class="fw-md">Notify me when back in stock</h4>
              <p>
                Sign up for email notifications and we’ll let you know when this
                product comes back in stock
              </p>
              <lola-email-input-form
                :disabled="emailFormDisabled"
                @submit.native.prevent="handleStockFormSubmit"
              />
            </div>
            <notification ref="notif">
              <div class="flex flex--items-center">
                <blue-checkmark class="mr-3" />
                <div class="flex flex--column">
                  <h4 class="fw-md">Success!</h4>
                  <small
                    >You'll be notified when the product is available</small
                  >
                </div>
              </div>
            </notification>
            <notification ref="notifError">
              <div class="flex flex--items-center">
                <blue-checkmark class="mr-3" />
                <div class="flex flex--column">
                  <h4 class="fw-md">Error!</h4>
                  <small
                    >An error occurred, please contact us at
                    <a
                      :href="
                        'mailto:help@mylola.com?subject=Out Of Stock' +
                        product.title
                      "
                      style="cursor: pointer"
                      >help@mylola.com</a
                    ></small
                  >
                </div>
              </div>
            </notification>
            <div class="value-props">
              <div
                v-for="(prop, index) in valueProps"
                :key="index"
                class="prop flex flex--items-center"
              >
                <div class="icon">
                  <nuxt-img
                    :src="sanitizeImageUrl(prop.imgSrc)"
                    :alt="prop.alt"
                  />
                </div>
                <span class="text">{{ prop.text }}</span>
              </div>
            </div>
            <section v-if="product.description" class="bottom-details">
              <div class="bottom-line" />
              <h4 class="details">Details</h4>
              <div class="product__list" v-html="descriptionInfo" />
            </section>
          </section>
        </section>
      </div>
      <section v-if="product" class="product__descriptions">
        <product-details-accordion :product="product" />
      </section>
      <div v-if="product">
        <side-by-side
          v-for="(content, index) in sideBySideContent"
          :key="index"
          v-bind="content"
        />
        <section id="reviews" class="product-reviews">
          <reviews-widget
            v-if="product"
            :product="product"
            :pathname="$route.fullPath"
          />
        </section>
        <you-might-like :handles="youMightLike" />
      </div>
    </div>
    <div v-else class="cart__loader">
      <div class="lds-dual-ring"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import account from '@/mixins/account.js'
import { encode } from 'js-base64'
import UpsellProductForm from '@/components/lola/UpsellProductForm.vue'
import Breadcrumbs from '@/components/lola/Breadcrumbs.vue'
import IconChevronDown from '@/components/lola/icons/IconChevronDown'
import ProductDetailsAccordion from '@/components/lola/pdp/ProductDetailsAccordion.vue'
import marked from 'marked'
import ProductMediaDesktop from '~/components/lola/ProductMediaDesktop.vue'
import ProductMediaMobile from '~/components/lola/ProductMediaMobile.vue'
import productModule from '~/store/product/productModule'
import productMixin from '~/mixins/product'
import productMetafields from '~/mixins/productMetafields'
import YouMightLike from '~/components/lola/YouMightLike.vue'
import subscriptions from '~/mixins/subscriptions'
import SingleProduct from '~/components/lola/SingleProduct.vue'
import SideBySide from '~/components/lola/SideBySide'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton.vue'
import Loader from '~/components/lola/Loader.vue'
import commonMixins from '~/mixins/commonMixins'
import PromoStrip from '~/components/lola/PromoStrip.vue'
import LolaEmailInputForm from '~/components/lola/LolaEmailInputForm.vue'
import { isOutOfStock, apiOutOfStock } from '~/helpers/product'
import Notification from '~/components/lola/Notification.vue'
import BlueCheckmark from '~/components/lola/icons/BlueCheckmark.vue'

export default {
  components: {
    BlueCheckmark,
    Breadcrumbs,
    IconChevronDown,
    UpsellProductForm,
    Notification,
    ProductDetailsAccordion,
    ProductMediaDesktop,
    ProductMediaMobile,
    YouMightLike,
    SideBySide,
    SingleProduct,
    ProductAddToCartButton,
    Loader,
    PromoStrip,
    LolaEmailInputForm
  },
  mixins: [
    productMetafields,
    productMixin,
    subscriptions,
    commonMixins,
    account
  ],
  props: {
    subscription: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      cartIsFull: true,
      descriptionInfo: '',
      emailFormDisabled: false,
      loaded: false,
      namespace: '',
      topOffset: 0,
      quantity: 1,
      showStars: false,
      product__: null,
      subscriptionType: 'payg'
    }
  },
  async fetch() {
    const handle = this.$route.params.productHandle
    this.namespace = `product/${handle}`
    if (!this.$store.hasModule(this.namespace)) {
      this.$store.registerModule(this.namespace, productModule(), {
        preserveState: !!this.$store.state[this.namespace]
      })
    }
    const product = await this.$store.dispatch(
      `${this.namespace}/fetchProduct`,
      handle
    )

    if (!(product && product.metadata)) return

    if (this.isRechargeEdit) {
      const {
        quantity,
        properties = [],
        shopify_variant_id: variantId
      } = this.subscription
      const prepayType = properties.find(
        (prop) => prop.name === 'prepay_subscription_type'
      )
      const product_ = JSON.parse(JSON.stringify(product))
      const { metadata } = product_

      // set the selected subscription defaults
      this.quantity = quantity
      // this.setSelectedQuantity(quantity)
      this.setSelectedVariantId(variantId)
      metadata.assortmentSkus = this.getSkuString(properties)
      metadata.prepaidDefaultSelection = prepayType
        ? parseInt(prepayType.value.replace('prepaid_', ''))
        : null
      product_.metadata = metadata
      this.setProduct(product_)
    } else {
      this.setProduct(product)
    }
  },
  head() {
    if (this.product) {
      const meta = []
      const titles = []
      const {
        metadata,
        title: productTitle,
        description: productDescription
      } = this.product
      const title = metadata.seoTitle || productTitle
      const description = metadata.seoDescription || productDescription
      const globalTitle = this.getMetatag('title')

      if (title) {
        titles.push(title)
      }

      if (globalTitle) {
        titles.push(globalTitle.value)
      }

      const fullTitle = titles.join(' | ')

      meta.push({
        hid: 'og:title',
        property: 'og:title',
        content: fullTitle
      })

      meta.push({
        hid: 'description',
        name: 'description',
        content: description
      })
      meta.push({
        hid: 'og:description',
        property: 'og:description',
        content: description
      })

      if (this.product.featuredMedia) {
        meta.push({
          hid: 'og:image',
          property: 'og:image',
          content: this.product.featuredMedia.src
        })
      }

      return {
        title: fullTitle,
        meta
      }
    }
  },
  computed: {
    ...mapGetters('space', ['getMetatag']),
    ...mapGetters('global', [
      'globalPromoCardData',
      'globalPromoData',
      'loading'
    ]),
    productLoading() {
      return this.$fetchState.pending && !this.loaded
    },
    selectedVariant() {
      let variant = null
      if (!this.selectedVariantId) return variant

      const variantToDuplicate = this.product.metadata.variantToDuplicate
      const reverseID =
        Object.keys(variantToDuplicate).find(
          // eslint-disable-next-line eqeqeq
          (key) => variantToDuplicate[key] == this.selectedVariantId
        ) || this.selectedVariantId

      const encodedId = encode(`gid://shopify/ProductVariant/${reverseID}`)

      // Check if this is a prepaid product
      if (this.isPrepaidProduct) {
        // Search through prepaid products first
        const product = this.product.metadata.prepaidProducts.find((x) => {
          const _variant = x.variants.find((y) => y.id === encodedId)
          if (_variant) {
            variant = _variant
            return true
          }

          return false
        })

        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.product__ = product || this.product
      }

      if (!variant) {
        // Search through product's main variants
        variant = this.product.variants.find((x) => x.id === encodedId)
      }

      if (!variant) {
        // Select first available variant
        variant = this.product.variants[0]
      }

      return variant
    },
    sideBySideContent() {
      let { sideBySideContent } = this.product.metadata
      if (!Array.isArray(sideBySideContent)) {
        sideBySideContent = [sideBySideContent]
      }

      return sideBySideContent
    },
    youMightLike() {
      return (this.product?.metadata?.youMightLike || []).map(
        (x) => x.handle.split('::')[0]
      )
    },
    productMedia() {
      return this.product.media.map(({ src, type }) => ({ src, type }))
    },
    promoData() {
      const promoData =
        this.product.metadata.promoBanner || this.globalPromoData
      if (!promoData) return null
      const fields = promoData?.fields || {}
      const { popupTextAlignment, popupCopy } =
        this.globalPromoCardData?.fields || {}
      return { ...fields, popupTextAlignment, popupCopy }
    },
    valueProps() {
      const { valueProps } = this.product.metadata
      return valueProps.map(({ text, icon }) => {
        const { description, title, file } = icon.fields

        return { text, imgSrc: file.url, alt: description || title }
      })
    },
    hasBreadcrumbs() {
      return this.product.metadata && this.product.metadata.breadcrumbs
    },
    hasQuantityInfo() {
      return this.product.metadata && this.product.metadata.quantityInfo
    }
  },

  watch: {
    '$route.query': '$fetch',
    product: {
      immediate: true,
      handler(product) {
        // if (product) this.showPageLoader(false)
      }
    },
    quantity: {
      immediate: false,
      handler(quantity) {
        this.setSelectedQuantity(quantity)
      }
    }
  },
  async mounted() {
    if (this.$store.state[this.namespace]) {
      const { product, selectedVariant } = this.$store.state[this.namespace]
      if (product) {
        this.productView({ product, selectedVariant })
      } else {
        const p = await this.$store.dispatch(
          `${this.namespace}/fetchProduct`,
          this.$route.params.productHandle
        )
        this.setProduct(p)
        const { product: pr, selectedVariant: sv } =
          this.$store.state[this.namespace]
        this.productView({ product: pr, selectedVariant: sv })
      }
    }

    // Make image viewer sticky
    const header = document.getElementById('app-header') || {}
    this.topOffset = (header.offsetHeight || 0) + 'px'
    this.appendStars(1200)
    setTimeout(() => {
      this.descriptionInfo = marked.parseInline(
        this.product?.metadata?.descriptionInfo || ''
      )
    }, 50)
  },

  beforeDestroy() {
    const namespace = `product/${this.product.handle}`
    this.$store.commit(`${namespace}/unloadProduct`)
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapActions('events', ['productView']),
    ...mapMutations('global', ['showPageLoader']),
    // show star rating if greater than 4
    appendStars(time) {
      let tries = 0
      const stars =
        document.querySelector('.standalone-bottomline .yotpo-bottomline') ||
        null
      if (stars) {
        const starRating = stars
          .querySelector('.sr-only')
          .textContent.split(' ')[0]
        const ratingCount = stars.querySelector('.text-m')

        ratingCount.textContent =
          '(' + ratingCount.textContent.split(' ')[0] + ')'

        if (starRating >= 4) {
          this.showStars = true
        }
      } else {
        tries++
        if (tries < 4) {
          setTimeout(() => {
            this.appendStars(time)
          }, time)
        }
      }
    },
    handleStockFormSubmit({ target }) {
      const email = new FormData(target).get('email')
      // DISABLE FORM
      this.emailFormDisabled = true
      apiOutOfStock(this.$config.serverlessEndpoint, this.product, email)
        .then((res) => {
          // Show success notification
          this.$refs.notif.showNotification()
        })
        .catch(() => {
          // ENABLE FORM
          this.emailFormDisabled = true
          // Show error notification
          this.$refs.notifError.showNotification()
        })
    },
    outOfStock(product) {
      return isOutOfStock(product, product.tags)
    },
    pdpIsReady() {
      this.loaded = true
    },
    updateSubscriptionType(option) {
      this.subscriptionType = option
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin select-style {
  border: 1px solid #dcdcdc;
  border-radius: 2px;
}

@mixin button-style {
  flex: 1;
  line-height: 23px;
  text-transform: none;
  height: 40px;
  border-radius: 24px;
  letter-spacing: 0;
  font-size: 16px;
}

$dark-blue: #4e6282;
$dark-brown: #514945;

.has-gift-card {
  .cart-btn-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    .gift-btn {
      width: calc(50% - 10px);
    }

    button.add-to-cart {
      color: $dark-blue !important;
      background-color: transparent !important;
      margin: 0 !important;
      border: 1.5px solid $dark-blue !important;

      &:hover {
        color: #fff !important;
        background-color: $dark-brown !important;
        border-color: $dark-brown !important;
      }
    }
  }
}

::v-deep {
  .site-breadcrumbs {
    padding-left: 88px;
  }
}

#lola-product-page {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding-bottom: 40px;

  .product__main {
    display: flex;
    padding: 0;

    .promo-banner-pdp {
      margin-top: 20px;

      .promo-text {
        flex: 1;
        p {
          font-size: 0.9rem;
        }
      }
    }

    .breadcrumbs---images {
      position: sticky;
      align-self: flex-start;
      flex: 1;
      padding-right: 40px;
      padding-top: 10px;
      width: 100%;
    }

    .value-props {
      .prop {
        font: normal 12px/23px 'Apercu Pro';
        margin-bottom: 8px;
      }

      .icon {
        margin-right: 8px;
        line-height: 1.001;
      }
    }

    &--details {
      background: #ffffff;
      width: 400px;
      max-width: 100%;
      margin-top: 28px;

      .heading {
        font-family: 'Apercu Medium', sans-serif;

        .title {
          font-size: 24px;
          line-height: 38px;
          margin-bottom: 10px;
        }
      }

      .info {
        font: 14px/23px 'Apercu Medium', sans-serif;
        margin-bottom: 10px;

        small {
          color: #aca6a5;
        }

        .count--strike {
          text-decoration: line-through;
        }
      }

      .description {
        padding-top: 20px;
      }

      .bottom-details {
        .details {
          padding-top: 32px;
          font: 16px/23px 'Apercu Medium', sans-serif;
        }

        .product__list {
          padding: 0;
          padding-top: 8px;
          font-size: 16px;
          font-family: 'Apercu Light';

          ul {
            position: relative;
            padding: 0;

            li {
              display: flex;
              align-items: center;

              &::before {
                content: ' ';
                background-color: $dark-blue;
                font-weight: bold;
                display: inline-block;
                border-radius: 50%;
                width: 6px;
                height: 6px;
              }
            }
          }
        }
      }

      .cart-btn-section {
        display: flex;

        .qty {
          margin-right: 7px;
          display: flex;
          min-width: 65px;
          position: relative;

          select {
            margin: 0;
            cursor: pointer;
            @include select-style;
          }

          .dropdown-toggle {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            display: flex;
            padding: 12px;
            align-items: center;
            pointer-events: none;
          }
        }
        button {
          @include button-style();
          background: #4e6282;
          color: #fff;

          &:hover {
            background-color: #fff;
            color: #4e6282;
            border: 1px solid #4e6282;
          }
        }
      }

      .subscription-item__remove-button {
        background-color: #514945;
        color: #fff;
        border: 1px solid #514945;
        width: 100%;
        margin-top: 10px;

        &:hover {
          color: #514945;
          background-color: transparent;
        }
      }

      .coupon-subscription {
        text-align: center;
        font: 12px/23px 'Apercu Medium', sans-serif;

        p {
          margin: 18px 0;
        }
      }

      .description {
        .product__body {
          p,
          span {
            font-family: 'Apercu Light';
            font-size: 16px;
          }
        }
      }
    }
  }

  .side-modal {
    background-image: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#f7eeeb),
      color-stop(96%, #f7eeeb),
      color-stop(4%, #c88d75)
    );
    background-image: linear-gradient(
      to right,
      #f7eeeb,
      #f7eeeb 96%,
      #c88d75 4%
    );
    width: 375px;
    height: 100%;
    max-width: 100%;
    z-index: 199;
    color: #514945;
    position: initial;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translateX(-200%);
    transition: all ease-in 0.3s;

    &.reveal {
      transform: translateX(0);
    }

    .title {
      display: block;
      margin: 0 0 0.725em;
      font-size: 1.37rem;
      color: #c88d75;
    }

    .sub-title {
      margin: 0 0 0.725em;
      font-size: 1rem;
      margin-bottom: 0;
      color: #c88d75;
    }
  }

  .value-props {
    margin-top: 20px;
  }

  @media screen and (min-width: 769px) and (max-width: 1074px) {
    padding-left: 25px;
    padding-right: 25px;
  }

  @media screen and (max-width: 768px) {
    padding-bottom: 0;

    ::v-deep {
      .site-breadcrumbs {
        padding-left: 15px;
      }
    }

    .side-modal {
      transform: translateY(-150%);
      &.reveal {
        transform: translateY(0);
      }
    }

    .product__main {
      flex-direction: column;

      .breadcrumbs---images {
        position: initial;
        padding: 0;
      }

      &--details {
        padding: 24px;
        margin: 0 auto;

        .heading {
          .title {
            font-size: 20px;
            line-height: 26px;
          }
        }

        .info {
          .review-link {
            padding: 0;
          }
        }
      }
    }
  }

  @media screen and (max-width: 375px) {
    .product__main {
      &--details {
        padding: 24px 15px;
        margin: 0 auto;
      }
    }
  }
}
.products-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.product-reviews {
  width: 80vw;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 0;
}

.notification-form {
  margin-top: 36px;
  p {
    font-size: 14px;
    color: $light-brown;
  }
}
</style>
