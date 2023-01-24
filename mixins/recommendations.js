import { mapGetters, mapActions } from 'vuex'
import productModule from '~/store/product/productModule'

export default {
  computed: {
    ...mapGetters('product/recommendations', ['getRecommendedProducts'])
  },
  methods: {
    ...mapActions('product/productModule', ['getProducts']),
    async getProductsByHandles(handles) {
      const namespace = 'product/products'
      if (!this.$store.hasModule(namespace)) {
        this.$store.registerModule(namespace, productModule(), {
          preserveState: !!this.$store.state[namespace]
        })
      }

      const recommendedProducts = this.getRecommendedProducts.reduce(
        (acc, curr) => {
          acc[curr.handle] = curr
          return acc
        },
        {}
      )

      const products = []
      const missingProductsHandles = [] // Store handles of products not yet available

      handles.forEach((handle) => {
        const product = recommendedProducts[handle]
        if (product) {
          products.push(product)
        } else {
          missingProductsHandles.push(handle)
        }
      })

      if (missingProductsHandles.length) {
        // Fetch missing products
        const missingProducts = await this.$store.dispatch(
          `${namespace}/getProducts`,
          missingProductsHandles
        )
        missingProducts.forEach((product) => products.push(product))
      }

      return products
    }
  }
}
