<template>
  <div v-show="!isOutOfStock" class="subscription-type-selector">
    <header>
      <p>Payment options</p>
      <span
        v-if="contentPopups['purchase-options']"
        class="purchase-option"
        @click="handlePurchaseLinkClick"
        >Purchase options</span
      >
    </header>
    <span v-if="!isRechargeEdit" class="option">
      <input
        v-if="subscriptionType === 'onetime'"
        type="hidden"
        name="onetime"
        value="onetime"
      />
      <label class="has-hover" @click="handleSelection('onetime')">
        <div class="info">
          <radio-icon
            width="18"
            height="18"
            :checked="subscriptionType === 'onetime'"
          />
          <div class="details">
            <h3>Buy one time</h3>
          </div>
          <span class="box-info">{{
            getPriceInfo(product.metadata.oneTimePrice / 100)
          }}</span>
        </div>
      </label>
    </span>
    <span v-if="!isDailyMultivitamin" class="option">
      <label @click="handleDropdownToggle">
        <div class="tag">
          <span>Up to {{ percentageOff }}% off</span>
        </div>
        <div class="info">
          <radio-icon
            width="18"
            height="18"
            :checked="subscriptionType !== 'onetime'"
          />
          <div class="details">
            <h3>Subscribe to save</h3>
          </div>
          <span class="box-info" v-html="activeSubscriptionPrice"></span>
        </div>
        <div
          v-show="previewContent && subscriptionType !== 'onetime'"
          class="prepay-selected-preview"
        >
          <div class="info">
            <reload-icon class="flex--align-start" />
            <div
              class="details"
              :style="{ paddingRight: '8px' }"
              v-html="previewContent"
            ></div>
            <span class="box-info">
              <arrow-toggle :style="{ width: '8px', marginRight: '5px' }" />
            </span>
          </div>
        </div>
      </label>
    </span>
    <div
      class="selector"
      :class="{ expanded: showDropDown, relative: isAccountModal }"
    >
      <span class="option" data-subscription-type="payg">
        <input
          v-if="subscriptionType === 'payg'"
          type="hidden"
          value="payg"
          name="properties[prepay_subscription_type]"
        />
        <label class="has-hover" @click="handleSelection(null, -1)">
          <div class="info">
            <radio-icon
              width="18"
              height="18"
              :checked="subscriptionType === 'payg'"
              class="flex--align-start"
            />
            <div class="details">
              <h3>Go with your flow</h3>
              <small
                ><p>
                  Delivered every {{ getDeliveryInfo(selectedFrequency) }}
                </p></small
              >
            </div>
            <span class="box-info">{{
              getPriceInfo(product.metadata.subscriptionPrice / 100)
            }}</span>
          </div>
          <delivery-frequency-selector v-if="subscriptionType === 'payg'" />
        </label>
      </span>
      <span
        v-for="({ qty, price, weeks, priceInfoText }, key, index) in options"
        :key="key"
        class="option"
        :data-subscription-type="getValue(qty)"
      >
        <template
          v-if="subscriptionType === getValue(qty) && hasSubscriptionId"
        >
          <input
            id="rc_subscription_id"
            type="hidden"
            name="properties[subscription_id]"
            :value="product.metadata.subscriptionId"
          />
          <input
            id="rc_shipping_interval_unit_type"
            type="hidden"
            name="properties[shipping_interval_unit_type]"
            value="weeks"
          />
          <input
            id="shipping_interval_frequency"
            type="hidden"
            name="properties[shipping_interval_frequency]"
            :value="weeks"
          />
          <input
            id="fulfillable_quantity"
            type="hidden"
            name="properties[fulfillable_quantity]"
            :value="qty * parseInt(selectedQuantity)"
          />
        </template>
        <input
          v-if="subscriptionType === getValue(qty)"
          type="hidden"
          :value="getValue(qty)"
          name="properties[prepay_subscription_type]"
        />
        <label class="has-hover" @click="handleSelection(qty, index)">
          <!-- <div class="tag">
            <span v-html="getTagHtml(tag)" />
          </div> -->
          <div class="info">
            <radio-icon
              width="18"
              height="18"
              :checked="subscriptionType === getValue(qty)"
              class="flex--align-start"
            />
            <div class="details">
              <h3>Every {{ weeks / 4 }} months</h3>
              <small
                v-html="
                  getFormattedInfoText(
                    priceInfoText,
                    price,
                    parseInt(weeks / 4)
                  )
                "
              />
            </div>
            <span class="box-info">{{ getPriceInfo(price / qty) }}</span>
          </div>
        </label>
      </span>
    </div>
    <input
      v-if="subscriptionType !== 'payg'"
      type="hidden"
      name="properties[referenced_product_handle]"
      :value="product.handle"
    />
    <popup
      :show="showPopup"
      :fill-box="true"
      @modal-clicked="showPopup = false"
      @close-popup="closePopup"
    >
      <div v-html="popupContent"></div>
    </popup>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import productMixin, { getPopupContent } from '@/mixins/product'
import modalMixins from '@/mixins/modalMixins'
import subscriptions from '@/mixins/subscriptions'
import { isOutOfStock } from '@/helpers/product'
import DeliveryFrequencySelector from './DeliveryFrequencySelector'
import ArrowToggle from './icons/ArrowToggle'
import RadioIcon from './icons/RadioIcon'
import ReloadIcon from './icons/ReloadIcon'
import Popup from '~/components/lola/Popup.vue'

export default {
  components: {
    DeliveryFrequencySelector,
    RadioIcon,
    ReloadIcon,
    ArrowToggle,
    Popup
  },
  mixins: [productMixin, modalMixins, subscriptions],
  props: {
    productKey: {
      type: Number,
      default() {
        return 0
      }
    },
    isAccountModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeSubscriptionPrice: '',
      options: {},
      selection: null,
      prepaidProducts: [],
      prepayTags: {},
      previewContent: '',
      subscriptionType: 'payg',
      selectedFrequency: null,
      selectorOptions: [],
      showDropDown: false,
      showPopup: false
    }
  },
  computed: {
    ...mapGetters('global', ['globalModalContent', 'globalModalIsVisible']),
    isOutOfStock() {
      return isOutOfStock(this.product, this.product.tags)
    },
    percentageOff() {
      const productPrice = this.product.metadata.oneTimePrice / 100
      let lowestPricePerItem = Number.MAX_VALUE
      this.prepaidProducts.forEach(({ priceRange, data }) => {
        const pricePerItem = parseFloat(priceRange.max) / data.prepaidQty
        if (pricePerItem < lowestPricePerItem) {
          lowestPricePerItem = pricePerItem
        }
      })

      const percentage = this.calculatePercentageOff(
        lowestPricePerItem,
        productPrice
      )
      return parseInt(percentage)
    },
    popupContent() {
      return getPopupContent(this.contentPopups, 'purchase-options')
    },
    prepaidDefaultSelection() {
      return this.product.metadata.prepaidDefaultSelection
    }
  },
  watch: {
    subscriptionType: {
      immediate: true,
      handler(type) {
        this.$emit('subscription-update', type) // quick-view
        this.$parent.$emit('subscription-update', type)
        if (type !== 'onetime') {
          this.$nextTick(() => {
            const option = this.selectorOptions.find(
              (x) => x.getAttribute('data-subscription-type') === type
            )
            if (option) {
              setTimeout(() => {
                this.setPreviewContent(option)
              }, 200)
            }
          })
        }
      }
    }
  },
  created() {
    const { prepaidProducts } = this.product.metadata
    this.prepaidProducts = prepaidProducts
    const options = {}
    prepaidProducts.forEach((product) => {
      const { prepaidQty, weeks, priceInfoText, tag } = product.data
      const price = product.priceRange.max
      options[prepaidQty] = {
        qty: prepaidQty,
        price,
        weeks,
        priceInfoText,
        tag
      }
    })
    this.options = options
    this.prepayTags = this.globalPrepayData.prepayTags
    this.selectedFrequency =
      this.product.metadata.selectedShippingIntervalFrequency || 4
  },
  mounted() {
    const { prepaidDefaultSelection = null } = this.product.metadata
    this.$nextTick(() => {
      this.setSubscriptionType(prepaidDefaultSelection)
    })
    const container = this.$el
    const selectorDiv = container.querySelector('.selector')
    const options = selectorDiv.querySelectorAll('.option')
    this.selectorOptions = Array.from(options)
  },
  methods: {
    ...mapMutations('global', ['showGlobalModal']),
    closePopup() {
      this.showPopup = false
    },
    collapseDropdown() {
      this.showDropDown = false
    },
    getDeliveryInfo(freq) {
      return freq > 4 ? `${freq / 4} months` : 'month'
    },
    getFormattedInfoText(priceInfoText = '', price, months) {
      return priceInfoText
        .replace('{price}', this.getCurrency() + parseFloat(price).toFixed(2))
        .replace('{frequency}', months)
    },
    getPriceInfo(price) {
      return (
        this.getCurrency() +
        (Number.isInteger(price) ? price : price.toFixed(2)) +
        '/' +
        (this.product.metadata.containerText || 'item')
      )
    },
    getValue(option) {
      return `prepaid_${option}`
    },
    handlePurchaseLinkClick() {
      this.showPopup = true
    },
    handleSelection(option) {
      this.showDropDown = false
      this.setSubscriptionType(option)
    },
    handleDropdownToggle() {
      this.toggleDropdown()
      if (this.subscriptionType !== 'onetime') {
        return
      }
      this.setSubscriptionType(this.prepaidDefaultSelection)
    },
    setPreviewContent(option) {
      const details = option.querySelector('.details')
      const priceInfo = option.querySelector('.box-info')
      this.previewContent = details.innerHTML
      this.activeSubscriptionPrice = priceInfo.innerHTML
    },
    setSubscriptionType(selection) {
      this.subscriptionType = 'payg'

      if (Object.keys(this.options).includes(selection + '')) {
        this.subscriptionType = this.getValue(selection)
        // The SingleProduct component expects a number for prepaid products
        // If we return a string, then it means that the desired product is PAYG
        selection = parseInt(selection)
      }

      if (selection === 'onetime') {
        this.subscriptionType = 'onetime'
        this.selection = null
      }

      this.$emit('update', selection)
    },
    toggleDropdown() {
      this.showDropDown = !this.showDropDown
    }
  }
}
</script>

<style lang="scss" scoped>
.subscription-type-selector {
  padding-bottom: 20px;
  position: relative;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    p {
      font: 16px/23px 'Apercu Medium', sans-serif;
      margin-bottom: 0;
    }

    .purchase-option {
      display: block;
      text-align: right;
      font: 12px/16px 'Apercu Medium', sans-serif;
      color: #999391;
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        color: #4e6282;
      }
    }
  }

  .prepay-selected-preview {
    padding-top: 15px;
    border-top: 0.8px solid #dcdcdc;
    margin-top: 20px;
    margin-bottom: -8px;
    cursor: pointer;
  }

  .selector {
    position: absolute;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 5;
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.25s linear;
    transition-property: max-height, border-color, box-shadow;
    border: 1px solid transparent;

    &.expanded {
      max-height: 600px;
      border-color: #dcdcdc;
      box-shadow: 0px 6px 10px 0px #00000030;
    }

    &.relative {
      position: relative;
    }

    .option {
      padding-top: 0 !important;
      label {
        border: none;
        padding: 12px;
      }
    }
  }

  .option {
    display: flex;
    align-items: center;
    padding-top: 0;
    position: relative;

    &:not(:first-of-type) {
      padding-top: 18px;
    }

    input {
      visibility: hidden;
      height: 0;
      width: 0;
      margin: 0;
    }

    label {
      position: relative;
      padding: 20px 12px;
      border: 1px solid #dcdcdc;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      text-transform: none;
      margin-bottom: 0px;
      width: 100%;
      cursor: pointer;

      .tag {
        position: absolute;
        top: -12px;
        left: 0;
        // right: 0;
        padding: 0 5px;
        background-color: #4e6282;
        color: #fff;
        border-radius: 2px;
        box-shadow: 0px 1px 1px #00000029;
        min-width: 42px;
        text-align: center;

        span {
          font: 12px/17px 'Apercu Medium', sans-serif;

          ::v-deep p {
            margin: 0;
            letter-spacing: 0;
            font-size: 13px;
          }

          ::v-deep .prepay-product-tag {
            display: flex;
            justify-content: space-between;

            > img {
              margin-left: -10px;
              padding-right: 4px;
            }
          }
        }
      }

      .info {
        display: flex;
        align-items: center;
        .details {
          h3 {
            font: 16px/15px 'Apercu Light', sans-serif;
            margin-bottom: 4px;
            letter-spacing: 0;
          }

          small {
            font: 12px/15px 'Apercu Pro', sans-serif;
            color: #999391;

            ::v-deep p {
              margin: 0;
              letter-spacing: 0;
              font-size: 14px;
              margin-top: 8px;
            }
          }
        }

        .box-info {
          font: 16px/15px 'Apercu Light', sans-serif;
          flex: 1;
          letter-spacing: 0;
          text-align: right;
          text-transform: lowercase;
        }
      }

      .delivery-frequency-selector {
        margin-top: 10px;
        margin-bottom: 0;
      }
    }

    input:checked + label {
      background: #f8f6f2;
    }
  }

  .has-hover:hover {
    background: #f8f6f2;
  }
}
</style>
