/* eslint-disable prefer-const */
import { mapMutations, mapState } from 'vuex'
import { products } from '@/locales/en.default.json'
import { getAdditionalSkuInfo } from '../helpers/product'
const translations = products.skus

export default {
  computed: {
    ...mapState('assortment', [
      'additionalSkuInfo',
      'assortmentOptionsInfo',
      'assortmentTabInfo',
      'cache',
      'productUpdateData',
      'initialAssortment',
      'showPopup'
    ]),
    hasAssortments() {
      return this.product.metadata.assortmentSkus?.length
    },
    isDefaultAssortment() {
      let { defaultAssortmentSkus, assortmentSkus } = this.product.metadata
      defaultAssortmentSkus = defaultAssortmentSkus || assortmentSkus

      defaultAssortmentSkus = defaultAssortmentSkus?.split(',').sort().join()

      const currentAssortmentSkus = Object.keys(
        this.assortmentOptionsInfo || []
      )
        .reduce((acc, key) => {
          acc.push(`${key}:${this.assortmentOptionsInfo[key]}`)
          return acc
        }, [])
        .sort()
        .join()

      return defaultAssortmentSkus === currentAssortmentSkus
    },
    selectedCount() {
      return Object.keys(this.assortmentOptionsInfo || {}).reduce(
        (acc, key) => {
          acc += parseInt(this.assortmentOptionsInfo[key])
          return acc
        },
        0
      )
    }
  },
  data() {
    return {
      translations
    }
  },
  methods: {
    ...mapMutations('assortment', [
      'setAdditionalSkuInfo',
      'setAssortmentOptionsInfo',
      'setAssortmentTabInfo',
      'setCache',
      'setProductUpdateData',
      'setInitialAssortment',
      'setShowPopup'
    ]),
    buildSkuSearchString(assortment) {
      return Object.keys(assortment).reduce((sku, key) => {
        sku += assortment[key].toString().padStart(2, '0')
        return sku
      }, '')
    },
    buildUpdateData(data) {
      // this.cartIsFull doesn't exist in the mobile assortment
      // component cos it's value will always be true.
      // This is because you can't increase/decrease
      // the total number of items in the assortment
      // on mobile.
      const data_ = { ...data }
      const cartIsFull = this.cartIsFull === undefined ? true : this.cartIsFull
      return Object.assign(data_, {
        cartIsFull
      })
    },
    decrementSku(sku) {
      const currentValue = parseInt(this.assortmentOptionsInfo[sku])
      const optionsInfo = { ...this.assortmentOptionsInfo }
      optionsInfo[sku] = currentValue - 1
      this.setAssortmentOptionsInfo(optionsInfo)
      this.updatePrekitData(sku)
      this.updateTabSelection()
    },
    getAdditionalSkuInfo() {
      return getAdditionalSkuInfo(this.product)
    },
    getAssortmentOptionsInfo() {
      return (this.product.metadata.assortmentSkus || '')
        .split(',')
        .reduce((acc, array) => {
          const [key, value] = array.split(':')
          acc[key] = value
          return acc
        }, {})
    },
    getAssortmentTabInfo() {
      return (this.product.metadata.standardPrekitAssortments || '')
        .split(',')
        .reduce((acc, value) => {
          acc[this.snakeCase(value)] = value
          return acc
        }, {})
    },
    getProductClasses(color) {
      return [this.product.productType.toLowerCase() + 's', color]
    },
    handleAssortmentUpdate() {
      const source = this.productUpdateData || this.cache.assortmentUpdateData
      let { type, name } = source
      const assortment = this.assortmentOptionsInfo
      const skuString = this.buildSkuSearchString(assortment)
      if (type === 'custom') {
        name = 'Custom'
      }

      const product = this.activeProduct || this.product

      let variant = product.variants.find(
        (x) =>
          x.sku.includes(skuString) &&
          !x.selectedOptions.some(
            (option) => option.value.toLowerCase() === 'volume discount'
          )
      )

      if (!variant) {
        variant =
          product.variants.find(
            (x) =>
              x.selectedOptions[0].value === name &&
              x.selectedOptions[1].value.toLowerCase() !== 'volume discount'
          ) || {}
      }

      this.updateSelectedVariantId(variant.id)

      this.setCache(source)
    },
    incrementSku(sku) {
      if (this.cartIsFull) {
        return
      }
      const currentValue = parseInt(this.assortmentOptionsInfo[sku])
      const optionsInfo = { ...this.assortmentOptionsInfo }
      optionsInfo[sku] = currentValue + 1
      this.setAssortmentOptionsInfo(optionsInfo)
      this.updatePrekitData(sku)
      this.updateTabSelection()
    },
    isEmpty(key) {
      // Using <= in case some skus already have negative values
      return parseInt(this.assortmentOptionsInfo[key]) <= 0
    },
    selectAllOfSkuType(skuIndex, value) {
      let newSkuData = {}
      const infoKeys = Object.keys(this.assortmentOptionsInfo)
      let index = 0
      if (skuIndex >= infoKeys.length) {
        // Revert to original popular assortment
        newSkuData = this.getAssortmentOptionsInfo()
      } else {
        infoKeys.forEach((key) => {
          index === skuIndex
            ? (newSkuData[key] = parseInt(
                this.product.metadata.totalCount || 0
              ))
            : (newSkuData[key] = 0)
          index++
        })
      }

      this.setAssortmentOptionsInfo(newSkuData)
      const data = { type: 'prekit', name: value }
      this.setProductUpdateData(this.buildUpdateData(data))
      this.handleAssortmentUpdate()
    },
    snakeCase(string) {
      return string.replace('+', '-plus').replace(/\W+/g, '-').toLowerCase()
    },
    updatePrekitData(sku) {
      const data = { type: 'custom' }
      const count = parseInt(this.product.metadata.totalCount)
      if (parseInt(this.assortmentOptionsInfo[sku]) === count) {
        data.type = 'prekit'
        data.name = 'All ' + translations[sku]
      }
      this.setProductUpdateData(this.buildUpdateData(data))
      this.handleAssortmentUpdate()
    },
    setInitialTabSelection() {
      // set initial prekit or custom assortment and updates variant id
      const skus = Object.keys(this.assortmentOptionsInfo)
      const count = parseInt(this.product.metadata.totalCount)
      const sku = skus.find(
        (sku) => parseInt(this.assortmentOptionsInfo[sku]) === count
      )
      if (sku) {
        this.updatePrekitData(sku)
        this.updateTabSelection()
      } else {
        const data = { type: 'custom' }
        this.setProductUpdateData(this.buildUpdateData(data))
        this.handleAssortmentUpdate()
      }
    },
    updateTabSelection() {
      let id = 'assortment-'
      if (this.productUpdateData.type === 'prekit') {
        id += this.snakeCase(this.productUpdateData.name)
      }

      const tabInput = document.getElementById(id)
      if (tabInput) {
        tabInput.checked = true
      } else {
        const tabInputs = document.querySelectorAll(
          '.tabs .assortment__list-input'
        )
        tabInputs.forEach((input) => (input.checked = false))
      }
    },
    updateProductInfo(product) {
      if (!product) {
        return
      }
      this.setAdditionalSkuInfo(this.getAdditionalSkuInfo())
      this.setAssortmentOptionsInfo(this.getAssortmentOptionsInfo())
      this.setAssortmentTabInfo(this.getAssortmentTabInfo())
    }
  }
}
