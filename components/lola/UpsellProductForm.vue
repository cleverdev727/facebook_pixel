<template>
  <div class="upsell-product">
    <span
      class="add-form-selector flex flex--align-start"
      @click="addForm = !addForm"
    >
      <input v-model="addForm" type="checkbox" />
      <radio-icon
        style="pointer-events: none"
        width="18"
        height="18"
        :checked="addForm"
      />
    </span>
    <section>
      <h5 class="title">{{ product.title }} &nbsp;{{ '+' + price }}</h5>
      <div
        class="description"
        v-html="documentToHtmlString(product.body)"
      ></div>
      <a class="learn-more" :href="product.ctaUrl" target="_blank">
        {{ product.ctaText }}</a
      >
    </section>
    <form
      v-if="addForm"
      action="/cart/add"
      class="product-form upsell-product-form"
    >
      <template v-if="product.metadata.isSubscriptionOnly">
        <input
          type="hidden"
          name="properties[subscription_id]"
          :value="product.metadata.subscriptionId"
        />
        <input
          type="hidden"
          name="properties[shipping_interval_unit_type]"
          :value="product.metadata.shippingIntervalUnitType"
        />
        <input
          type="hidden"
          name="properties[shipping_interval_frequency]"
          :value="shippingIntervalFrequency"
        />
        <input type="hidden" value="autodeliver" name="purchase_type" />
      </template>
      <template v-else>
        <input type="hidden" value="onetime" name="purchase_type" />
      </template>
      <input type="hidden" name="quantity" value="1" />
      <input type="hidden" name="id" :value="variantId" />
      <input type="hidden" name="shopify_variant_id" :value="variantId" />
    </form>
  </div>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import RadioIcon from '@/components/lola/icons/RadioIcon'
import { getShopifyVariantId } from '~/helpers/product'

export default {
  components: { RadioIcon },
  props: {
    formProduct: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      addForm: false,
      documentToHtmlString
    }
  },
  computed: {
    price() {
      return '$' + this.product.metadata.oneTimePrice / 100
    },
    product() {
      return this.formProduct
    },
    variantId() {
      const duplicates = this.product.metadata.variantToDuplicate
      const selectedVariant = this.product.variants[0]
      const id = getShopifyVariantId(selectedVariant.id)
      return duplicates[id] || id
    },
    shippingIntervalFrequency() {
      if (Array.isArray(this.product?.metadata?.shippingIntervalFrequency)) {
        return this.product.metadata.shippingIntervalFrequency[0]
      }
      return this.product?.metadata?.shippingIntervalFrequency
    }
  }
}
</script>

<style scoped lang="scss">
.upsell-product {
  position: relative;
  padding: 16px 30px;
  background-color: #f8f6f2;
  display: flex;
  margin: 10px 0 30px 0;

  .add-form-selector {
    margin-right: 14px;
    cursor: pointer;

    [type='checkbox'] {
      height: 0px;
      visibility: hidden;
      width: 0;
    }
  }

  .title {
    font-size: 12px;
    line-height: 15px;
    margin-bottom: 8px;
    font-weight: 600;
    font-family: 'Apercu Medium';
  }

  .description {
    padding-top: 0px !important;
    ::v-deep p {
      font: 12px/16px 'Apercu Pro';
      color: #999391;

      &:last-of-type {
        margin: 0;
      }
    }
  }

  .learn-more {
    font: 12px/16px 'Apercu Pro';
  }

  @media screen and (max-width: 650px) {
    padding: 16px 20px;
  }
}
</style>
