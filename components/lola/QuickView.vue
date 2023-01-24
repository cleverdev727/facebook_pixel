<template>
  <div class="quick-view-component" :class="{ 'is-visible': quickViewVisible }">
    <popup
      :show="quickViewVisible"
      @modal-clicked="hideQuickView"
      @close-popup="hideQuickView"
    >
      <form class="quick-view" method="post" action="/cart/add">
        <div
          class="form-content"
          :class="isAccountModal ? 'form-content__narrow' : ''"
        >
          <template v-if="product">
            <header v-if="!isAccountModal">
              <h3>{{ product.title }}</h3>
              <span class="info">{{ assortmentMobileInfo }}</span>
            </header>
            <header v-else>
              <a
                class="form-content_link"
                :to="'/products/' + product.handle"
                @click.prevent="handleLinkClick(product)"
              >
                <nuxt-img
                  class="form-content_link-img"
                  :src="product.media[0].src"
                  :alt="product.title"
                />
              </a>
              <div>
                <a
                  class="form-content_link"
                  :href="'/products/' + product.handle"
                  @click.prevent="handleLinkClick(product)"
                >
                  <span class="title">{{ product.title }}</span>
                </a>
                <section class="info">
                  <span v-if="product.metadata" class="count">{{
                    product.metadata.quantityInfo
                  }}</span>
                  <small
                    v-if="
                      !(hasSubscriptionId || isGiftCard) || isMembershipProduct
                    "
                    >for</small
                  >
                  <small v-else>starting at</small>
                  <span
                    :class="{ 'count--strike': isMember && membershipDiscount }"
                    >{{ startingAtPrice }}</span
                  >
                </section>
                <section
                  v-if="!hasAssortments && product.description"
                  class="description"
                >
                  <div class="product__body" v-html="product.description" />
                </section>
              </div>
            </header>
            <section class="body">
              <addresses v-if="isRechargeUpsell" :is-upsell-modal="true" />
              <div v-if="isAccountModal" class="assortment-customizer">
                <assortment-customizer
                  v-if="hasAssortments"
                  :assortment-data="assortmentData"
                  :show-box="false"
                />
              </div>
              <div v-else>
                <assortment-mobile
                  v-if="hasAssortments && showMobileAssortment"
                  @refresh="handleMobileAssortmentRefresh"
                />
              </div>
              <div v-if="isSubscriptionOnly" class="subscription-selector">
                <div v-if="isAccountModal">
                  <template v-if="isPrepaidProduct">
                    <subscription-type-selector
                      :is-account-modal="isAccountModal"
                      @update="handlePrepaidSelection"
                      @subscription-update="updateSubscriptionType"
                    />
                  </template>
                  <template v-else>
                    <div id="rc_container">
                      <delivery-frequency-selector />
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="isGiftCard">
                <gift-card-variant-selector />
              </div>
              <div v-else-if="product.metadata.useSizeSelector">
                <size-selector />
              </div>
              <div v-else>
                <purchase-type-selector
                  @update="handleFrequencySelection"
                  @subscription-update="updateSubscriptionType"
                />
              </div>
            </section>
            <section class="footer">
              <input type="hidden" name="id" :value="selectedVariantId" />
              <input
                type="hidden"
                name="shopify_variant_id"
                :value="selectedVariantId"
              />
              <input type="hidden" name="quantity" :value="selectedQuantity" />
              <input
                v-if="product.metadata.isValuePack"
                type="hidden"
                name="properties[fulfillable_quantity]"
                value="8"
              />
              <div :class="isAccountModal ? 'cart-btn-section' : ''">
                <div v-if="isAccountModal" class="qty">
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
                  :use-upsell-product="false"
                  :disabled="!selectedVariant"
                  form="quick-view"
                  :is-recharge-add="isRechargeUpsell"
                  @item-added="hideQuickView"
                />
              </div>
              <div class="error-box-mobile" :class="{ reveal: showError }">
                <h3>{{ error.title || error.name }}</h3>
                <span>{{ error.summary }}</span>
              </div>
              <div v-if="!isAccountModal">
                <div class="bottom-line"></div>
                <section v-if="product.description" class="bottom-details">
                  <h4 class="details">Details</h4>
                  <div class="product__list" v-html="descriptionInfo" />
                </section>
                <a
                  :href="`/products/${product.handle}`"
                  class="learn-more links--learn-more"
                  @click.prevent="handleLinkClick(product)"
                  >Learn more</a
                >
              </div>
            </section>
          </template>
        </div>
      </form>
    </popup>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import marked from 'marked'
import assortmentMixin from '@/mixins/assortmentMixins'
import prepayMixins from '@/mixins/prepayMixins'
import productMixin from '@/mixins/product'
import subscriptionMixin from '@/mixins/subscriptions'
import AssortmentMobile from '@/components/lola/AssortmentMobile.vue'
import AssortmentCustomizer from '@/components/lola/AssortmentCustomizer.vue'
import Addresses from '@/components/account/PdpAddresses.vue'
import GiftCardVariantSelector from '@/components/lola/GiftCardVariantSelector.vue'
import SizeSelector from '@/components/lola/SizeSelector.vue'
import Popup from '@/components/lola/Popup.vue'
import IconChevronDown from '@/components/lola/icons/IconChevronDown'
import DeliveryFrequencySelector from './DeliveryFrequencySelector'
import SubscriptionTypeSelector from './SubscriptionTypeSelector'
import PurchaseTypeSelector from './PurchaseTypeSelector.vue'

export default {
  components: {
    Addresses,
    AssortmentMobile,
    AssortmentCustomizer,
    GiftCardVariantSelector,
    Popup,
    SizeSelector,
    DeliveryFrequencySelector,
    PurchaseTypeSelector,
    SubscriptionTypeSelector,
    IconChevronDown
  },
  mixins: [assortmentMixin, prepayMixins, productMixin, subscriptionMixin],
  data() {
    return {
      assortmentData: null,
      cartIsFull: true,
      product__: null,
      error: {},
      operation: 'add',
      posting: false,
      reveal: false,
      showError: false,
      quantity: 1,
      subscriptionType: 'payg'
    }
  },
  computed: {
    ...mapState('quick-view', ['quickViewVisible']),
    assortmentMobileInfo() {
      const { quantityInfo } = this.product.metadata
      const price = this.getPriceWithCurrency('onetime')
      let info = `${price} / ${quantityInfo}`
      if (this.isSubscriptionOnly) {
        info += ' / Buy one time'
        // info += ' / subscription'
      }
      return info
    },
    descriptionInfo() {
      return marked.parseInline(this.product?.metadata?.descriptionInfo || '')
    },
    isAccountModal() {
      return (
        this.$route.path.includes('/account/orders') || this.isRechargeUpsell
      )
    },
    showMobileAssortment() {
      return (
        this.$route.path.includes('/collections') || this.$route.path === '/'
      )
    }
  },
  methods: {
    ...mapMutations('quick-view', ['setQuickViewVisible', 'toggleQuickView']),
    handleLinkClick({ handle }) {
      this.hideQuickView(() => {
        this.$nextTick(() => {
          this.$router.push({ path: '/products/' + handle })
        })
      })
    },
    handleMobileAssortmentRefresh(assortment) {
      this.assortmentData = assortment
    },
    hideQuickView(fn) {
      this.setQuickViewVisible(false)
      setTimeout(() => {
        this.setProduct(null)
        this.assortmentData = null
        this.cartIsFull = true

        if (fn && typeof fn === 'function') {
          fn()
        }
      }, 400)
    },
    updateSubscriptionType(option) {
      this.subscriptionType = option
    }
  }
}
</script>

<style lang="scss" scoped>
.quick-view-component {
  .quick-view {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 480px;
    transform: translateX(5000px);

    .form-content {
      margin: 0 auto;
      background-color: white;
      border-radius: 5px;
      padding: 0 15px;
      animation: dismiss-popup 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      width: 100%;
      max-height: 480px;
      overflow-y: auto;

      &__narrow {
        max-width: 25em;
      }

      &_link {
        text-decoration: none;
        min-width: 8em;
      }

      &_link-img {
        width: 100px;
      }

      // start assortment customizer styles overriedes
      @media screen and (max-width: 768px) {
        .assortment__wrapper footer {
          display: none !important;
        }
      }

      .assortment--suggestion strong {
        font-size: 12px;
      }

      .assortment--customizer {
        padding: 0;
      }

      .subscription-selector {
        transform: scale(0.9);
      }

      .purchase-type-selector {
        transform: scale(0.9);
      }

      .assortment-customizer {
        transform: scale(0.9);
      }
      // end assortment customizer styles overrides

      header {
        position: relative;
        text-align: center;
        display: flex;

        .info {
          text-align: left;
          font-size: 12px;

          .count {
            display: inline-block;
            margin: 0.6em 0;
          }
        }

        .description {
          text-align: left;
          font-size: 11px;
        }

        .title {
          display: block;
          text-align: left;
          font: 100 14px 'Apercu Medium', sans-serif;
          margin-bottom: 4px;
          color: #4e6282;
        }

        h3 {
          font: 100 22px/26px 'Apercu Medium', sans-serif;
          margin-bottom: 4px;
          padding: 0 15px;
        }

        .close-icon {
          position: absolute;
          top: 0;
          right: -9px;

          svg {
            pointer-events: none;
          }
        }

        .info {
          font: 14px/23px 'Apercu Light', sans-serif;
        }
      }

      .footer {
        padding: 20px 0;

        .add-to-cart {
          width: 100%;
          margin: 0;
        }
        .error-box-mobile {
          display: none;
        }

        .bottom-line {
          border-width: 1px;
        }

        .learn-more {
          font-family: 'Apercu Pro';
          font-size: 14px;
          margin-top: 8px;
          color: #999391;
        }

        .features {
          padding-top: 24px;

          h4 {
            font-size: 14px;
            font-weight: bold;
            margin: 0;
          }

          .description {
            font: 14px/22px 'Apercu Light', sans-serif;

            ul {
              li::before {
                content: ' ';
                background-color: #4e6282;
                border-radius: 50%;
                font-weight: bold;
                display: inline-block;
                width: 6px;
                height: 6px;
                margin-right: 8px;
              }
            }
          }

          .links {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            a {
              font: 14px/18px 'Apercu Medium';
            }

            &--trial-set-product {
              display: flex;
              align-items: center;

              svg {
                width: 36px;
                height: 36px;
                padding-right: 4px;
              }
            }
          }
        }
      }

      .purchase-type-selector,
      .subscription-type-selector {
        padding-top: 20px;
        padding-bottom: 0;
      }

      .subscription-type-selector_relative {
        color: blue;

        .selector {
          position: relative;
        }
      }
    }

    .bottom-details {
      .details {
        padding-top: 15px;
        font: 16px/23px 'Apercu Medium', sans-serif;
      }
    }

    ::v-deep {
      .size-selector {
        .size-options {
          display: none;
        }
        .variants {
          margin-bottom: 0;
          margin-top: 20px;
        }
      }
    }
  }

  &.is-visible {
    .quick-view {
      transform: translateX(0px);
      .form-content {
        animation: expand-popup 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
        border: 1px solid #dcdcdc;
        border-radius: 2px;
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
      flex: 1;
      line-height: 23px;
      text-transform: none;
      height: 40px;
      border-radius: 24px;
      letter-spacing: 0;
      font-size: 16px;
      background: #4e6282;
      color: #fff;

      &:hover {
        background-color: #fff;
        color: #4e6282;
        border: 1px solid #4e6282;
      }
    }
  }
}
</style>
