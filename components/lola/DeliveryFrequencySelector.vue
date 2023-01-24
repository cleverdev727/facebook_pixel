<template>
  <div
    v-if="hasSubscriptionId"
    v-show="false"
    class="delivery-frequency-selector"
    :class="{ 'bundle-selector': isBundle }"
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
      :value="shippingFrequencyUnitType"
    />
    <div class="selector">
      <span>Delivered every</span>
      <select
        v-model="shippingFrequency"
        name="properties[shipping_interval_frequency]"
      >
        <option
          v-for="frequency in product.metadata.shippingIntervalFrequency"
          :key="frequency"
          :value="frequency"
        >
          {{ frequencyText(frequency) }}
        </option>
      </select>
      <chevron-down />
    </div>
  </div>
</template>

<script>
import productMixin from '@/mixins/product'
import subscriptions from '@/mixins/subscriptions'
import ChevronDown from './icons/ChevronDown'

export default {
  components: {
    ChevronDown
  },
  mixins: [productMixin, subscriptions],
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
      shippingFrequency: null
    }
  },
  computed: {
    shippingFrequencyUnitType() {
      return this.product.metadata.shippingIntervalUnitType.toLowerCase()
    }
  },
  watch: {
    shippingFrequency: {
      immediate: true,
      handler(frequency) {
        if (!frequency) return
        this.$emit('update', frequency)
      }
    }
  },
  created() {
    this.shippingFrequency =
      this.product.metadata.selectedShippingIntervalFrequency || 4
  },
  methods: {
    frequencyText(frequency) {
      return `${frequency} ${this.shippingFrequencyUnitType}`
    }
  }
}
</script>

<style lang="scss" scoped>
.delivery-frequency-selector {
  margin-bottom: 6px;

  .selector {
    position: relative;
    display: flex;
    font: 16px/15px 'Apercu Light', sans-serif;
    letter-spacing: 0;
    justify-content: space-between;
    align-items: center;

    select {
      font-family: 'Apercu Medium', sans-serif;
      margin: 0;
      cursor: pointer;
      border: 1px solid #dcdcdc;
      border-radius: 2px;
      margin-left: 20px;
      max-width: 200px;
      color: #514944;
    }
  }

  svg {
    width: 14px;
    height: 14px;
    position: absolute;
    top: 30%;
    pointer-events: none;
    right: 12px;
  }
}
</style>
