import { mapMutations } from 'vuex'

export default {
  computed: {
    contentPopups() {
      const popups = this.product.metadata.contentPopup
      if (!Array.isArray(popups)) return { [popups.popupType]: popups }

      return popups.reduce((acc, curr) => {
        acc[curr.popupType] = curr
        return acc
      }, {})
    }
  },
  methods: {
    ...mapMutations('global', ['setGlobalModalContent', 'showGlobalModal']),
    handlePurchaseLinkClick() {
      const { text, image } = this.contentPopups['purchase-options']
      if (image) {
        this.setGlobalModalContent(
          `
            <img class="content-popup-img" src="${image.fields.file.url}" alt="${image.fields.title}" />
          `
        )
      } else {
        this.setGlobalModalContent(
          `
            <div class="side-modal__content-sub">
              ${text}
            </div>
          `
        )
      }

      this.$nextTick(() => this.showGlobalModal(true))
    }
  }
}
