import { camelCase } from 'camel-case'
import { products } from '@/locales/en.default.json'
import { apiPost } from '@/helpers/api'
import { hasSubscriptionId } from '@/helpers/subscription'
const translations = products.skus
let valuePackProducts = null

// fetch PDP data from contentful and append to product
export const addPDPDataToProduct = async ({ ...product }, $nacelle) => {
  product.productType = product.productType || ''
  let contentData

  try {
    contentData = await $nacelle.data.content({
      handle: product.globalHandle,
      type: 'productPage'
    })
  } catch (error) {
    console.warn(`product page for handle: ${product.globalHandle} not found.`)
    return product
  }

  if (valuePackProducts === null) {
    try {
      const products = await $nacelle.data.collectionPage({
        handle: 'value-packs'
      })

      valuePackProducts = products || []
    } catch (error) {
      console.warn(error)
    }
  }

  const metafields = product.metafields || []
  const contentSource = generateContentSource(contentData)

  contentSource.fields = contentData.fields
  contentSource.metafields = metafields.reduce((acc, curr) => {
    acc[camelCase(curr.key)] = curr.value
    return acc
  }, {})

  product.metadata = await buildProductMetadata(contentSource, $nacelle)

  // Check if product is a value pack
  const exists = valuePackProducts.find((x) => x.id === product.id)
  product.metadata.isValuePack = !!exists

  // membership product
  const { pdpUpsellProduct } = contentSource

  if (pdpUpsellProduct) {
    const upsellProduct = await $nacelle.data.product({
      handle: getShopifyHandle(pdpUpsellProduct.productHandle)
    })
    const contentData = await $nacelle.data.content({
      handle: upsellProduct.globalHandle,
      type: 'productPage'
    })

    const contentSource = generateContentSource(contentData)

    contentSource.fields = contentData.fields
    contentSource.metafields = (upsellProduct.metafields || []).reduce(
      (acc, curr) => {
        acc[camelCase(curr.key)] = curr.value
        return acc
      },
      {}
    )

    upsellProduct.metadata = await buildProductMetadata(contentSource, $nacelle)
    upsellProduct.metadata.oneTimePrice =
      parseFloat(upsellProduct.priceRange.max) * 100

    product.metadata.upsellProduct = {
      ...pdpUpsellProduct,
      ...upsellProduct
    }
  }

  let selectedShippingIntervalFrequency

  // Set default shipping frequency
  if (
    ['liners', 'lubricant', 'essential-oil', 'hand-sanitizer'].some((entry) =>
      product.handle.includes(entry)
    )
  ) {
    selectedShippingIntervalFrequency = 8
  } else if (product.productType.toLowerCase() === 'membership') {
    selectedShippingIntervalFrequency = 12
  } else {
    selectedShippingIntervalFrequency = 4
  }

  // Extra metadata
  product.metadata.oneTimePrice = parseFloat(product.priceRange.max) * 100
  product.metadata.selectedShippingIntervalFrequency =
    selectedShippingIntervalFrequency
  product.metadata.useSizeSelector = product.tags.includes('multi-size')
  product.metadata.appendSkuAsLineItem = 'cup-lube,cup-pads,cup-liners'
    .split(',')
    .includes(product.handle)

  product.metadata.isPreorder = product.tags.includes('pre-order')

  // Update metadata to use `relatedArticles` instead of `youMightLike` field
  product.metadata.youMightLike = contentData.relatedArticles

  return product
}

const generateContentSource = (data) => {
  return (data.sections || []).reduce((acc, curr) => {
    const { fields, sys } = curr
    const { id } = sys.contentType.sys
    if (acc[id]) {
      const currentItem = acc[id]
      if (!Array.isArray(currentItem)) {
        acc[id] = [currentItem]
      }
      acc[id].push(fields)
    } else acc[id] = fields
    return acc
  }, {})
}

export const buildProductMetadata = async (source, $nacelle) => {
  const productHandles = []
  const metadata = {}

  const {
    accordionGroup = {},
    breadcrumb = { breadcrumbs: [] },
    contentPopup = [],
    prepayVariants = { products: [] },
    fields,
    metafields,
    promoBanner,
    sideBySideContent = [],
    valueProps = { props: [] }
  } = source
  metadata.breadcrumbs = breadcrumb.breadcrumbs.map((item) => {
    return item.fields
  })

  metadata.accordions = (accordionGroup.accordions || []).map(
    (item) => item.fields
  )

  metadata.valueProps = valueProps.props.map((item) => item.fields)
  metadata.contentPopup = contentPopup
  metadata.sideBySideContent = sideBySideContent
  metadata.promoBanner = promoBanner ? { fields: { ...promoBanner } } : null

  const { features, subscriptionPrice = '' } = fields

  let prepayProducts = []

  prepayVariants.products.forEach((product) => {
    const { config, handle, priceInfoText } = product.fields
    const shopifyHandle = getShopifyHandle(handle)
    productHandles.push(shopifyHandle)

    const data = {
      ...config,
      priceInfoText
    }

    prepayProducts.push({
      handle: shopifyHandle,
      data
    })
  })

  const {
    originalToHiddenVariantMap = '{}',
    shippingIntervalFrequency = '',
    isSubscriptionOnly = false
  } = metafields

  let variantMapObj = JSON.parse(originalToHiddenVariantMap)

  const products = await $nacelle.data
    .products({
      handles: productHandles
    })
    .catch((error) => ({ error }))

  const productsObj = products.reduce((acc, curr) => {
    acc[curr.handle] = curr
    return acc
  }, {})

  prepayProducts = prepayProducts.map((x) => {
    const handle = x.handle
    const product = productsObj[handle]
    const variantMapMetafield =
      product.metafields.find(
        (x) => x.key === 'original_to_hidden_variant_map'
      ) || {}
    const variantMapObj_ = JSON.parse(variantMapMetafield.value || '{}')
    variantMapObj = {
      ...variantMapObj,
      ...variantMapObj_
    }

    return { ...x, ...product }
  })

  const metafieldsObj = {
    ...metafields,
    ...{
      isSubscriptionOnly:
        isSubscriptionOnly !== false && isSubscriptionOnly !== 'false',
      shippingIntervalFrequency: shippingIntervalFrequency.split(','),
      variantToDuplicate: buildVariantToDuplicate(variantMapObj)
    }
  }

  metadata.prepaidDefaultSelection = prepayVariants.defaultPrepaySelection
  metadata.prepaidProducts = prepayProducts
  metadata.descriptionInfo = features
  metadata.subscriptionPrice =
    parseFloat(subscriptionPrice.replace('$', '')) * 100

  return { ...fields, ...metadata, ...metafieldsObj }
}

export const getShopifyVariantId = (variantId) => {
  if (!variantId) return variantId
  if (Number.isInteger(variantId)) return variantId
  const match = variantId.toString().match('^[0-9]+$')
  if (match) return parseInt(variantId)

  try {
    const data = atob(variantId)
    const id = data.replace('gid://').split('/').pop()
    return id
  } catch (_) {
    // do nothing
  }

  return variantId
}

export const getAdditionalSkuInfo = (product) => {
  return (product.metadata.additionalSkuDefaults || '')
    .split(',')
    .reduce((acc, array) => {
      const [key, value] = array.split(':')
      if (key) {
        acc[key] = value
      }
      return acc
    }, {})
}

export const getAssortmentCountText = (skuProps = {}) => {
  const keys = Object.keys(skuProps)
  if (!keys.length) return ''

  return keys
    .reduce((acc, curr) => {
      const sku = curr.split(':').pop()
      const translation = translations[sku]
      if (translation) {
        const value = parseInt(skuProps[curr])
        if (value > 0) {
          acc.push(
            `
              <strong>${value}</strong>
              <span class="text--light">${translation}&nbsp;</span>
            `.trim()
          )
        }
      }

      return acc
    }, [])
    .join('')
}

export const getShopifyHandle = (handle) => {
  return handle.split('::')[0]
}

export const isGiftCard = (product) => {
  const { productType = '' } = product || {}
  return productType.toLowerCase() === 'gift card'
}

export const getStartingPrice = (product) => {
  if (isGiftCard(product)) {
    return (
      product.variants.reduce((acc, curr) => {
        acc = Math.min(curr.price, acc)
        return acc
      }, Number.MAX_VALUE) / 100
    )
  }

  const { prepaidProducts, subscriptionPrice } = product.metadata || {}
  if ((prepaidProducts || []).length) {
    const minPrepaidPrice = prepaidProducts.reduce((acc, product) => {
      const { priceRange, data } = product
      const boxPrice = parseFloat(priceRange.max) / data.prepaidQty
      acc = Math.min(acc, boxPrice)
      return acc
    }, Number.MAX_VALUE)

    const minPrice = Math.min(
      parseFloat(product.priceRange.min),
      minPrepaidPrice
    )

    return Number.isInteger(minPrice) ? minPrice : minPrice.toFixed(2)
  }

  const oneTimePrice = parseFloat(product.priceRange.min) || Number.MAX_VALUE

  if (hasSubscriptionId(product)) {
    // Returning oneTimePrice as a default value.
    // This is because some products in Sandbox have missing values.
    // The default return value isn't needed in production because
    // it is expected that the products are set up correctly.
    // I added it here because of some errors that show up in
    // sandbox only e.g price showing as $NaN
    return Math.min(subscriptionPrice / 100, oneTimePrice) || oneTimePrice
  }
  return oneTimePrice
}

export const isPayG = (metafields) => {
  return metafields.prepaySubscriptionType === 'payg'
}
export const isPrepayProduct = (metafields) => {
  return metafields.prepaySubscriptionType
}

export const itemPrice = (item, metadata) => {
  const metafields = convertMetafieldsToObject(item.metafields)
  const variantPrice = parseFloat(item.variant?.price)
  let price =
    isOneTimeProduct(metafields) ||
    (isPrepayProduct(metafields) && !isPayG(metadata))
      ? variantPrice
      : metadata.subscriptionPrice / 100

  // Default to variant price if price is NaN
  if (isNaN(price)) {
    price = variantPrice
  }

  return parseFloat(price) * item.quantity
}
export const orderIntervalUnit = (metafields) => {
  return metafields.orderIntervalUnit
}

export const prepaidItemQty = (item) => {
  const metafields = convertMetafieldsToObject(item.metafields)
  const { fulfillableQuantity = item.quantity } = metafields
  return parseInt(fulfillableQuantity)
}

export const isOneTimeProduct = (metafields) => {
  return !metafields.chargeIntervalFrequency
}

const buildVariantToDuplicate = (variantMapObj) => {
  return Object.keys(variantMapObj).reduce((acc, key) => {
    acc[key] = variantMapObj[key].discount_variant_id
    return acc
  }, {})
}

export const convertMetafieldsToObject = (metafields = []) => {
  return metafields.reduce((acc, curr) => {
    const key = curr.key.startsWith('_SKU:') ? curr.key : camelCase(curr.key)
    acc[key] = curr.value
    return acc
  }, {})
}

export const isOutOfStock = (product, tags) => {
  const { availableForSale } = product
  if (tags && ~tags.findIndex((x) => x.toLowerCase() === 'oos')) return true
  return !availableForSale
}

export const apiOutOfStock = async (baseUrl, product, email) => {
  const productId = getShopifyVariantId(product.pimSyncSourceProductId)
  const data = {
    productId,
    productTitle: product.title,
    email
  }
  const result = await apiPost(`${baseUrl}/snowflake/out-of-stock`, { data })
  return result
}

// account product helper functions
export const referenceHandle = (props) => {
  if (props) {
    const handle = props.find(
      (prop) => prop.name === 'referenced_product_handle'
    )
    return handle ? handle.value : ''
  }
}

export const getProduct = (id, props, products) => {
  const handle = referenceHandle(props)
  if (handle) {
    return products.find((product) => product.handle === handle)
  }
  return products.find((product) =>
    getShopifyVariantId(product.pimSyncSourceProductId).includes(id)
  )
}

export const getImageSrc = (sub, products) => {
  const { shopify_product_id: productId, properties = [] } = sub
  const product = getProduct(productId, properties, products)
  return product ? product.featuredMedia.src : ''
}
