export const smoothScroll = (target, options) => {
  const { duration = 300, offset = 0 } = options || {}
  let start = null
  const destinationY = target.offsetTop - offset
  const startingY = window.pageYOffset
  const diff = destinationY - startingY
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) {
      start = timestamp
    }
    const time = timestamp - start
    const percent = Math.min(time / duration, 1)
    window.scrollTo(0, startingY + diff * percent)
    if (time < duration) {
      window.requestAnimationFrame(step)
    }
  })
}
