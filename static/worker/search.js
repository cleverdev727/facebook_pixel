/* eslint-disable no-undef */
self.importScripts('https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js')

let workerSearchData

onmessage = function receiver(e) {
  const { searchData, options, value } = e.data

  if (searchData) {
    workerSearchData = searchData
  } else if (workerSearchData) {
    const prepayProduct = (product) =>
      product.handle.includes('3-month') || product.handle.includes('6-month')
    const results = new Fuse(workerSearchData, options)
      .search(String(value))
      .filter((result) => typeof result.item !== 'undefined')
      .map((result) => result.item)
      .filter((item) => item.handle && !prepayProduct(item))

    postMessage(results)
  }
}
