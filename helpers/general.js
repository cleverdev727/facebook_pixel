export const imagePlaceholder =
  'https://cdn.shopify.com/s/files/1/2660/3696/files/placeholder-product.jpg?v=1592402745'

export const removeKeys = (obj, keys) => {
  const keysObj = keys.reduce((acc, curr) => {
    acc[curr] = true
    return acc
  }, {})
  return Object.keys(obj).reduce((acc, curr) => {
    if (!keysObj[curr]) {
      acc[curr] = obj[curr]
    }

    return acc
  }, {})
}

export const addObjectFieldsToParent = (obj) => {
  const { fields = [], ...rest } = obj || {}
  Object.keys(fields).forEach((key) => {
    const data = fields[key]
    if (data) {
      rest[key] = data
    }
  })

  return rest
}
