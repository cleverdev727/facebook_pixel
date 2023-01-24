const loader = new Worker('/loaderWorker.js')

// wait for the page to completely load before initiating script loader
window.addEventListener('load', () => {
  // send a message to the loader to tell it how long to wait to trigger the return message
  loader.postMessage({ ms: 2000 })
})

loader.onmessage = () => {
  // fire the third party scripts
  loadScripts()

  // clean up the worker after it does its work
  loader.terminate()
}

const loadScripts = () => {
  // scripts.forEach((script) => {
  //   const { src, async, defer, body } = script
  //   if (!src) return
  //   const element = document.createElement('script')
  //   element.src = src
  //   element.type = 'text/javascript'
  //   if (async) element.setAttribute('async', '')
  //   if (defer) element.setAttribute('defer', '')
  //   if (body) {
  //     document.body.appendChild(element)
  //   } else {
  //     document.head.appendChild(element)
  //   }
  // })
}

// const scripts = [
//   {
//     src: 'https://d2v82nkpsxzrcr.cloudfront.net/ecocart.js?shop_name=mylola-com.myshopify.com',
//     async: true
//   }
// ]
