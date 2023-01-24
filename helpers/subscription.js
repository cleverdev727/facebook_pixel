export const hasSubscriptionId = (product = {}) => {
  return parseInt(product.metadata?.subscriptionId || 0) > 0
}
