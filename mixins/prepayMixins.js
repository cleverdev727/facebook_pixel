export default {
  methods: {
    getPrepaidProduct() {
      const { product, prepaidSelection } = this
      return product.metadata.prepaidProducts.find((product) => {
        const { prepaidQty } = product.data
        return prepaidQty === prepaidSelection // TODO: && months === frequency - need to clarify this later.;
      })
    },
    handlePrepaidSelection(selection) {
      this.prepaidSelection = selection
      this.updateDataLogic()
    },
    handleFrequencySelection(frequency) {
      this.frequency = frequency

      if (!this.isPrepaidProduct) return

      this.updateDataLogic()
    },
    updateDataLogic() {
      const prepaidProduct = this.getPrepaidProduct()

      const activeProduct = prepaidProduct
        ? Object.assign({}, prepaidProduct)
        : null

      this.setActiveProduct(activeProduct)

      this.cache.assortmentUpdateData
        ? this.handleAssortmentUpdate() // Will use cache if no data is passed
        : this.updateSelectedVariantId()
    }
  }
}
