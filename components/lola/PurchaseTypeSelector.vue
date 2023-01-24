<template>
  <div v-show="!isOutOfStock" class="purchase-type-selector">
    <div v-if="hasSubscriptionId && !isTrialSet">
      <header>
        <p>Payment options</p>
        <span
          v-if="modalInfo.howSubscriptionsWork.html"
          class="purchase-option"
          @click="handlePurchaseLinkClick"
          >More details</span
        >
      </header>
      <span v-if="!(isRechargeEdit || isRechargeAdd)" class="option">
        <input
          v-if="purchaseType === 'onetime'"
          type="hidden"
          value="onetime"
          name="purchase_type"
          class="rc_radio rc_radio__onetime gtm-pdp-one-time-purchase"
        />
        <label @click="updatePurchaseType('onetime')">
          <div class="info">
            <radio-icon
              width="18"
              height="18"
              :checked="purchaseType === 'onetime'"
            />
            <div class="details">
              <h3>Buy one time</h3>
            </div>
            <span class="box-info">{{ getPriceWithCurrency('onetime') }}</span>
          </div>
        </label>
      </span>
      <span class="option">
        <input
          v-if="purchaseType === 'autodeliver'"
          type="hidden"
          value="autodeliver"
          name="purchase_type"
          class="rc_radio rc_radio__autodeliver gtm-pdp-subscribe-to-save"
        />
        <label @click="updatePurchaseType('autodeliver')">
          <div class="tag">
            <span>Save {{ percentageOff }}%</span>
          </div>
          <div class="info">
            <radio-icon
              width="18"
              height="18"
              :checked="purchaseType === 'autodeliver'"
              class="flex--align-start"
            />
            <div class="details">
              <h3>Subscribe to save</h3>
              <small
                v-if="!(isRechargeEdit || isRechargeAdd)"
                style="font-size: 14px; margin-top: 8px; color: #aca6a5"
                >Delivered every {{ getDeliveryInfo(selectedFrequency) }}</small
              >
            </div>
            <span class="box-info">{{
              getPriceWithCurrency('subscription')
            }}</span>
          </div>
          <delivery-frequency-selector v-if="purchaseType === 'autodeliver'" />
        </label>
      </span>
    </div>
    <input
      v-for="(value, key) in additionalSkuInfo"
      v-else
      :key="key"
      :name="`properties[_SKU:${key}]`"
      type="hidden"
      :value="value"
    />
  </div>
</template>

<script>
import productMixin from '@/mixins/product'
import modalMixins from '@/mixins/modalMixins'
import subscriptionsMixin from '@/mixins/subscriptions'
import assortmentMixins from '@/mixins/assortmentMixins'
import { isOutOfStock } from '@/helpers/product'
import DeliveryFrequencySelector from './DeliveryFrequencySelector'
import RadioIcon from './icons/RadioIcon.vue'

export default {
  components: {
    DeliveryFrequencySelector,
    RadioIcon
  },
  mixins: [productMixin, modalMixins, assortmentMixins, subscriptionsMixin],
  props: {
    productKey: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      selectedFrequency: null
    }
  },
  computed: {
    isOutOfStock() {
      return isOutOfStock(this.product, this.product.tags)
    },
    percentageOff() {
      const productPrice = this.product.metadata.oneTimePrice / 100
      const subscriptionPrice = this.getPrice('subscription')

      const percentage = this.calculatePercentageOff(
        subscriptionPrice,
        productPrice
      )
      return parseInt(percentage)
    }
  },
  watch: {
    purchaseType: {
      immediate: true,
      handler(type) {
        this.$emit('subscription-update', type) // quick-view
        this.$parent.$emit('subscription-update', type) // single-product
      }
    }
  },
  created() {
    this.selectedFrequency =
      this.product.metadata.selectedShippingIntervalFrequency || 4
  },
  beforeMount() {
    const additionalInfo = this.getAdditionalSkuInfo()
    const additionalSkuInfo =
      Object.keys(additionalInfo).length > 0 ? additionalInfo : null
    this.setAdditionalSkuInfo(additionalSkuInfo)
  },
  mounted() {
    const type = this.purchaseType || this.defaultPurchaseType
    this.updatePurchaseType(type)
  },
  methods: {
    getTagHtml(tag) {
      return this.globalPrepayData.prepayTags[tag] || ''
    },
    updatePurchaseType(type) {
      this.setPurchaseType(type)
      this.updateSelectedVariantId(null, type)
    },
    getDeliveryInfo(freq) {
      return freq > 4 ? `${freq / 4} months` : 'month'
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-type-selector {
  padding-bottom: 20px;

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
}
</style>
