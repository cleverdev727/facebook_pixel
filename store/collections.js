import { addPDPDataToProduct } from './../helpers/product'

export const state = () => ({
  collections: []
})

export const getters = {
  getCollections(state) {
    return state.collections
  }
}

export const mutations = {
  addCollectionMutation(state, collection) {
    const { handle } = collection
    const hasCollection = state.collections.find(
      (collection) => collection.handle === handle
    )
    if (!hasCollection) {
      state.collections.push(collection)
    }
  },
  addCollectionsMutation(state, collections) {
    // For some reason, the static generated site
    // doesn't correctly filter the current collections.
    // Because of that, we are repeating the filtering here
    const currentCollections = state.collections.reduce((acc, curr) => {
      acc[curr.handle] = true
      return acc
    }, {})
    const collectionsToAdd = collections.filter(
      (x) => !currentCollections[x.handle]
    )
    state.collections = [...state.collections, ...collectionsToAdd]
  }
}

export const actions = {
  async getCollection({ state, commit }, handle) {
    let collection = state.collections.find((x) => x.handle === handle)
    if (collection) return collection

    collection = await this.$nacelle.data.collection({ handle }).catch(() => {
      console.warn(`No collection with handle: '${handle}' found`)
      return null
    })

    if (collection) {
      const {
        handle: h,
        productLists,
        title,
        featuredMedia,
        description
      } = collection
      const collectionContent = await this.$nacelle.data
        .content({ handle: h, type: 'collection' })
        .catch(() => {
          console.warn(`No collection page with that handle: ${h}`)
          return null
        })

      if (productLists.length > 0) {
        const handles = await productLists[0].handles

        let products = await this.$nacelle.data
          .products({ handles })
          .catch(() => {
            console.warn(`No products for these handles: ${handles}`)
            return null
          })

        if (products) {
          products = (
            await Promise.all(
              products.map((x) => {
                return addPDPDataToProduct(x, this.$nacelle).catch(() => null)
              })
            )
          ).filter((x) => !!x)

          const data = {
            handle: h,
            title: collectionContent?.fields?.collectionDisplayName || title,
            featuredMedia,
            products,
            promoCard: collectionContent?.fields?.promoCard,
            description
          }
          commit('addCollectionMutation', data)
          return data
        }
      }
    }
  },
  async fetchCollections({ state, commit }) {
    // Create an object containing handles
    // of current available collections
    const currentCollections = state.collections.reduce((acc, curr) => {
      acc[curr.handle] = true
      return acc
    }, {})

    const collections = []
    const page = await this.$nacelle.data
      .content({ handle: 'collections-page', type: 'page' })
      .catch(() => {
        console.warn(`collections-all page not found`)
        return null
      })

    if (page) {
      if (page.sections.length > 0) {
        const collectionHandles = page.sections[0].fields.collections.map(
          (collection) => collection.fields.handle
        )

        for (const handle of collectionHandles) {
          const hasCollection = currentCollections[handle]
          // Only fetch collections whose handles are
          // not in the `currentCollections` object
          if (!hasCollection) {
            const collection = await this.$nacelle.data
              .collection({ handle })
              .catch(() => {
                console.warn(`No collection with handle: '${handle}' found`)
                return null
              })

            if (collection) {
              const {
                handle: h,
                productLists,
                title,
                featuredMedia,
                description
              } = collection
              const collectionContent = await this.$nacelle.data
                .content({ handle: h, type: 'collection' })
                .catch(() => {
                  console.warn(`No collection page with that handle: ${h}`)
                  return null
                })

              if (productLists.length > 0) {
                const handles = await productLists[0].handles

                let products = await this.$nacelle.data
                  .products({ handles })
                  .catch(() => {
                    console.warn(`No products for these handles: ${handles}`)
                    return null
                  })

                if (products) {
                  products = (
                    await Promise.all(
                      products.map((x) => {
                        return addPDPDataToProduct(x, this.$nacelle).catch(
                          () => null
                        )
                      })
                    )
                  ).filter((x) => !!x)

                  const data = {
                    handle: h,
                    title:
                      collectionContent?.fields?.collectionDisplayName || title,
                    featuredMedia,
                    products,
                    promoCard: collectionContent?.fields?.promoCard,
                    description
                  }
                  collections.push(data)
                }
              }
            }
          }
        }
      }
    }

    commit('addCollectionsMutation', collections)

    return state.collections
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
