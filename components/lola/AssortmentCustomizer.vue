<template>
  <client-only>
    <div class="assortment--customizer">
      <section v-if="showBox" class="right">
        <div class="box">
          <assortment-box />
          <ul :class="variantClassname">
            <li
              v-for="(color, index) in variantColors"
              :key="index"
              :class="getProductClasses(color)"
            ></li>
          </ul>
        </div>
        <span class="custom-total">
          {{ selectedCount }} of {{ product.metadata.totalCount }}
          {{ pluralize(product.productType, 2).toLowerCase() }}
        </span>
        <button type="button" @click="saveAssortment">
          {{ saveButtonText }}
        </button>
        <a class="discard" @click.prevent="discardChanges">Discard changes</a>
      </section>
      <div v-if="showBox" class="separator"></div>
      <section class="left">
        <div class="assortment--suggestion">
          <strong>Customize your assortment</strong>
          <span
            :style="{
              visibility: isDefaultAssortment ? 'visible' : 'hidden'
            }"
            >(Or get started with our most popular)</span
          >
        </div>
        <div class="assortment__wrapper">
          <ul class="tabs">
            <li v-for="(value, key, index) in assortmentTabInfo" :key="key">
              <input
                :id="`assortment-${key}`"
                type="radio"
                name="assortment"
                class="assortment__list-input"
                :value="value"
                @click="selectAllOfSkuType(index, value)"
              />
              <label
                :for="`assortment-${key}`"
                :class="`assortment__list-label gtm-pdp-assortment-${key} ${key.replace(
                  'all-',
                  ''
                )}`"
                >{{ value }}</label
              >
            </li>
          </ul>
          <div class="options">
            <input
              v-for="(value, key) in additionalSkuInfo"
              :key="key"
              :name="`properties[_SKU:${key}]`"
              type="hidden"
              :value="value"
            />
            <div
              v-for="(value, key) in assortmentOptionsInfo"
              :key="key"
              class="options--row"
              :class="product.productType.toLowerCase()"
            >
              <div class="options--row__label">
                <span :class="snakeCase(translations[key])"></span>
                <label
                  :for="snakeCase(translations[key])"
                  :data-test-assortment-prekit-number="key"
                  >{{ translations[key] }}</label
                >
              </div>
              <div class="options--row__input">
                <button
                  type="button"
                  name="button-minus"
                  class="minus"
                  :disabled="isEmpty(key)"
                  @click="decrementSku(key)"
                >
                  <span>-</span>
                </button>
                <input
                  :id="snakeCase(translations[key])"
                  type="number"
                  :name="`properties[_SKU:${key}]`"
                  min="0"
                  :value="value"
                  max="18"
                  readonly="readonly"
                  class="input"
                />
                <button
                  :id="`${snakeCase(translations[key])}-btn`"
                  type="button"
                  name="button-plus"
                  :disabled="cartIsFull"
                  class="plus"
                  @click="incrementSku(key)"
                >
                  <span>+</span>
                </button>
              </div>
            </div>
          </div>
          <footer>
            <button type="button" @click="saveAssortment">
              {{ saveButtonText }}
            </button>
            <a class="discard" @click.prevent="discardChanges"
              >Discard changes</a
            >
          </footer>
        </div>
      </section>
    </div>
  </client-only>
</template>

<script>
import assortmentMixins from '@/mixins/assortmentMixins'
import modalMixins from '@/mixins/modalMixins'
import productMixin from '@/mixins/product'
import { pluralize } from '@/helpers/strings'
import AssortmentBox from './AssortmentBox'

export default {
  components: {
    AssortmentBox
  },
  mixins: [assortmentMixins, modalMixins, productMixin],
  props: {
    productKey: {
      type: Number,
      default() {
        return 0
      }
    },
    showBox: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      pluralize
    }
  },
  computed: {
    cartIsFull() {
      return this.selectedCount >= this.product.metadata.totalCount
    },
    productTotalText() {
      return this.cartIsFull ? "You're all set" : 'Select more'
    },
    saveButtonText() {
      const totalCount = parseInt(this.product.metadata.totalCount)
      const difference = totalCount - this.selectedCount
      return difference === 0 ? 'Save' : `Add ${difference} more to save`
    },
    variantClassname() {
      return this.product.productType.toLowerCase() === 'pad'
        ? 'assortment__variants-pad'
        : 'assortment__variants'
    },
    variantColors() {
      const assortmentOptionsInfo = this.assortmentOptionsInfo || {}
      return Object.keys(assortmentOptionsInfo).reduce((acc, key) => {
        const count = parseInt(assortmentOptionsInfo[key])
        for (let i = 0; i < count; i++) {
          acc.push(this.snakeCase(this.translations[key]))
        }
        return acc
      }, [])
    }
  },
  watch: {
    assortmentData: {
      deep: true,
      immediate: true,
      handler(info) {
        if (!info) {
          return
        }

        this.setAssortmentOptionsInfo(Object.assign({}, info))
      }
    },
    product: {
      deep: true,
      immediate: false,
      handler(product) {
        this.updateProductInfo(product)
        this.handleAssortmentUpdate()
      }
    }
  },
  beforeMount() {
    this.updateProductInfo(this.product)
    this.setInitialAssortment(Object.assign({}, this.assortmentOptionsInfo))
  },
  mounted() {
    this.$nextTick(() => {
      this.setInitialTabSelection()
    })
  },
  methods: {
    closePopup() {
      this.setShowPopup(false)
    },
    discardChanges() {
      this.setAssortmentOptionsInfo(Object.assign({}, this.initialAssortment))
      this.setInitialTabSelection()
    },
    saveAssortment() {
      if (this.cartIsFull) {
        this.closePopup()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin button-style {
  margin-top: 18px;
  background: #fff;
  border: 1px solid #514945;
  border-radius: 2px;
  color: inherit;
  font: 16px/23px 'Apercu Medium';
  height: 40px;
  border-radius: 20px;
  letter-spacing: 0;
}

.assortment {
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;

  &--copy {
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    &--link {
      text-decoration: underline;
      font: 12px/17px 'Apercu Medium' !important;
      color: #999391;
      cursor: pointer;

      &:hover {
        color: #4e6282;
      }
    }

    span {
      font: 16px/23px 'Apercu Medium';
      letter-spacing: 0px;
    }
  }

  &--variant-labels {
    display: flex;
    justify-content: flex-start;
    padding-top: 8px;

    .label {
      &:not(:first-of-type) {
        padding-left: 16px;
      }
    }
  }

  &--btn {
    @include button-style;
  }

  &--customizer {
    width: 720px;
    max-width: 100%;
    padding: 30px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;

    section {
      flex: 1;

      &.right {
        display: flex;
        flex-direction: column;
        align-items: center;
        .box {
          position: relative;
        }
        .custom-total {
          padding: 14px 0 18px;
          font: 22px/23px 'Apercu Medium', sans-serif;
        }

        button {
          @include button-style();
          width: 100%;
        }

        .discard {
          font-size: 14px;
          padding-top: 15px;
          text-decoration: underline;

          &:hover {
            color: #4e6282;
          }
        }
      }
    }

    .separator {
      width: 1px;
      background: #dcdcdc;
      margin: 0 30px;
    }
  }

  &--suggestion {
    display: flex;
    flex-direction: column;
    text-align: center;
    font-family: 'Apercu Medium';

    strong {
      font-weight: 500;
      font-size: 15px;
    }

    span {
      font-size: 14px;
      color: #999391;
    }
  }

  &__variants {
    top: 59%;

    &-pad {
      top: 43%;
      left: 26%;
    }
  }

  &__wrapper {
    padding: 0px;
    .tabs {
      border-radius: 30px;
      margin: 22px 0;
      padding: 5px 10px;
      font-size: 0.7rem;
      display: grid;
      text-align: center;
      grid-template-columns: repeat(auto-fit, minmax(25%, 1fr));
      background-color: #f8f8f8;
      -webkit-box-shadow: 0 8px 6px -6px rgba(0, 0, 0, 0.2);
      box-shadow: 0 8px 6px -6px rgba(0, 0, 0, 0.2);

      li {
        label {
          background: transparent;
        }
        input:checked + label {
          color: initial;
          border: 2px solid grey;
        }
      }
    }

    .options {
      &--row {
        display: grid;
        grid-template-columns: 60% 40%;
        -webkit-box-align: center;
        align-items: center;
        height: 40px;
        padding: 0 24px;
        margin-top: 10px;
        touch-action: manipulation;

        &__label {
          display: flex;

          span {
            height: 25px;
            width: 25px;
            margin-right: 5px;
            border-radius: 50%;
          }

          label {
            text-align: left;
            margin: auto 10px;
            font-size: 0.8rem;
            text-transform: none;
            letter-spacing: 0;
            font-size: 1rem;
          }
        }

        &__input {
          display: -webkit-box;
          display: flex;
          -webkit-box-pack: center;
          justify-content: center;
          font-size: 0.8rem;

          button {
            width: 35px;
            height: 35px;
            border: 1px solid #dcdcdc;
            border-radius: 50%;
            padding: 0px;
            text-align: center;
            font-size: 1.5rem;
            color: black;
            background: inherit;
            line-height: 1;

            span {
              display: flex;
              width: 35px;
              height: 35px;
              justify-content: center;
              align-items: center;
            }
          }
          button:hover,
          button:active {
            color: black;
            background: inherit;
            border: 1px solid #514945;
            outline: none;
          }

          [type='number'] {
            border: none;
            outline: none;
            -webkit-box-shadow: none;
            box-shadow: none;
            -webkit-appearance: textfield;
            -moz-appearance: textfield;
            appearance: textfield;
            text-align: center;
            font-size: 1.3rem;
            font-weight: 600;
            height: 100%;
            padding: 2px;
            background: none;
            width: 45px;
            margin-top: 2px;
            color: #514945;
          }
        }

        &.pad {
          span {
            &.regular,
            &.heavy {
              height: 9px;
              width: 25px;
              margin-top: 2px;
              margin-right: 5px;
              border-radius: 20px;
            }
          }
        }
      }
    }

    footer {
      display: none;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 0 0 30px;

    &--variant-labels {
      .label {
        .icon {
          width: 15px !important;
          height: 15px !important;
        }
        .text {
          font-size: 14px;
        }

        &:not(:first-of-type) {
          padding-left: 10px;
        }
      }
    }

    &--customizer {
      flex-direction: column;
      padding: 0 15px;

      section {
        &.right {
          button {
            display: none;
          }

          .discard {
            display: none;
          }
        }
      }

      .separator {
        display: none;
      }
    }

    &__wrapper {
      margin: 0 !important;

      footer {
        display: block;
        text-align: center;

        button {
          @include button-style();
          width: 100%;
        }

        .discard {
          font-size: 14px;
          padding-top: 15px;
          text-decoration: underline;
          padding: 20px 0;
          display: inline-block;
        }
      }
    }
  }

  @media screen and (max-width: $medium-screen) {
    &--customizer {
      section.right {
        .box {
          transform: scale(0.9);
        }

        .custom-total {
          padding-bottom: 8px;
          font-size: 18px;
          line-height: 20px;
          margin-top: -16px;
        }
      }
    }

    .tabs {
      margin: 16px 0;
      padding: 6px 10px;
    }

    ::v-deep {
      .pop-up--box {
        header {
          padding-bottom: 0;
        }
      }
    }
  }
}
</style>
