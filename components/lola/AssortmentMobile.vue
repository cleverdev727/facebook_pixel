<template>
  <div class="assortments--mobile">
    <div class="assortments">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="option"
        :class="{ active: option.active }"
        @click="makeActive(index, option.name)"
      >
        <component :is="option.icon" />
      </div>
    </div>
    <div class="absorbency">
      Absorbency:
      <span>{{ absorbencyText }}</span>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins/assortmentMixins'
import productMixin, { getPopupContent } from '@/mixins/product'
import CompactPopular from './icons/assortment/CompactPopular'
import CardboardPopular from './icons/assortment/CardboardPopular'
import NonAppPopular from './icons/assortment/NonAppPopular'
import TamponLight from './icons/assortment/TamponLight'
import PadHeavy from './icons/assortment/PadHeavy'
import PadLight from './icons/assortment/PadLight'
import PadPopular from './icons/assortment/PadPopular'
import Regular from './icons/assortment/Regular'
import Super from './icons/assortment/Super'
import SuperPlus from './icons/assortment/SuperPlus'

export default {
  components: {
    CompactPopular,
    CardboardPopular,
    NonAppPopular,
    TamponLight,
    PadHeavy,
    PadLight,
    PadPopular,
    Regular,
    Super,
    SuperPlus
  },
  mixins: [mixin, productMixin],
  data() {
    return {
      assortments: {
        pad: {
          day: PadLight,
          regular: PadLight,
          night: PadHeavy,
          heavy: PadHeavy,
          popular: PadPopular
        },
        tampon: {
          light: TamponLight,
          regular: Regular,
          super: Super,
          'super-plus': SuperPlus,
          popular: CompactPopular
        }
      },
      absorbencyText: 'Popular assortment',
      options: []
    }
  },
  watch: {
    product: {
      deep: true,
      immediate: true,
      handler(product) {
        this.updateProductInfo(product)
      }
    }
  },
  created() {
    this.options = this.getOptions()
    // Find regular selection. In case a future product doesn't have
    // a regular absorbency, select the first option i.e index 0.
    const regularSelectionIndex = Math.max(
      this.options.findIndex((x) => x.name.toLowerCase().includes('regular')),
      0
    )
    const selection = this.options[regularSelectionIndex]
    this.makeActive(regularSelectionIndex, selection?.name)
  },
  methods: {
    getOptions() {
      const productType = this.product.productType.toLowerCase()
      const options = Object.keys(this.assortmentTabInfo).reduce((acc, key) => {
        const tabKey = key.replace('all-', '')
        acc.push({
          active: false,
          name: this.assortmentTabInfo[key],
          icon: this.assortments[productType][tabKey]
        })
        return acc
      }, [])
      return options
    },
    makeActive(index, value) {
      if (index >= Object.keys(this.assortmentOptionsInfo).length) {
        this.absorbencyText = 'Popular Assortment'
      } else {
        this.absorbencyText = value
      }
      this.options.forEach((option, _index) => {
        option.active = index === _index
      })

      this.selectAllOfSkuType(index, value)
      this.$emit('refresh', Object.assign({}, this.assortmentOptionsInfo))
    },
    orderPopupContent() {
      return getPopupContent(this.contentPopups, 'absorbency')
    }
  }
}
</script>

<style lang="scss" scoped>
.assortments--mobile {
  .assortments {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 18px;

    .option {
      width: 25px;
      height: 25px;
      margin: 0 8px;
      transition: all ease-in 0.2s;

      &:hover {
        cursor: pointer;
      }

      &.active {
        padding: 2px;
        border: 1px solid #5b534e;
        border-radius: 50%;
        width: 26px;
        height: 26px;
      }

      svg {
        pointer-events: none;
      }
    }
  }

  .absorbency {
    padding-top: 12px;
    font: 12px/23px 'Apercu Medium', sans-serif;
    text-align: center;
    span {
      font-size: 14px;
    }
  }
}
</style>
