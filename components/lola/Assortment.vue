<template>
  <div class="assortment" :class="(product.productType || '').toLowerCase()">
    <div class="assortment--copy">
      <span>Your assortment</span>
      <span
        v-if="true"
        class="assortment--copy--link"
        @click="handleOrderLinkClick"
        >What should I get?</span
      >
    </div>
    <div class="assortment--variant-labels">
      <div
        v-for="(value, key) in assortmentOptionsInfo"
        :key="key"
        class="label"
      >
        <div class="icon" :class="snakeCase(translations[key])"></div>
        <div class="text">
          <strong class="qty">{{ value }}</strong>
          <span>{{ translations[key] }}</span>
        </div>
      </div>
    </div>
    <button type="button" class="assortment--btn" @click="showCustomizer">
      Customize your box
    </button>
    <pop-up
      :show="showPopup"
      @modal-clicked="setShowPopup(false)"
      @close-popup="discardAndClose"
    >
      <assortment-customizer />
    </pop-up>
    <pop-up
      :show="showOrderPopup"
      :fill-box="true"
      @modal-clicked="showOrderPopup = false"
      @close-popup="closeOrderPopup"
    >
      <div v-html="orderPopupContent"></div>
    </pop-up>
  </div>
</template>

<script>
import assortmentMixins from '@/mixins/assortmentMixins'
import modalMixins from '@/mixins/modalMixins'
import productMixin, { getPopupContent } from '@/mixins/product'
import { pluralize } from '@/helpers/strings'
import PopUp from './Popup'
import AssortmentCustomizer from './AssortmentCustomizer.vue'

export default {
  components: {
    AssortmentCustomizer,
    PopUp
  },
  mixins: [assortmentMixins, modalMixins, productMixin],
  data() {
    return {
      pluralize,
      showOrderPopup: false
    }
  },
  computed: {
    orderPopupContent() {
      return getPopupContent(this.contentPopups, 'absorbency')
    }
  },
  methods: {
    closeOrderPopup() {
      this.showOrderPopup = false
    },
    closePopup() {
      this.setShowPopup(false)
    },
    discardAndClose() {
      this.discardChanges()
      this.closePopup()
    },
    discardChanges() {
      this.setAssortmentOptionsInfo(Object.assign({}, this.initialAssortment))
    },
    handleOrderLinkClick() {
      this.showOrderPopup = true
    },
    showCustomizer() {
      this.setInitialAssortment(Object.assign({}, this.assortmentOptionsInfo))
      this.setShowPopup(true)
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
