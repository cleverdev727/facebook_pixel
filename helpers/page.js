export const generateBreadcrumbs = (route, options = {}) => {
  const { removeTrailingPath = false } = options
  let link = ''
  const crumbs = [{ link: '/', text: 'Home' }]
  const path = route.path
  if (!path) return crumbs

  const parts = path.split('/')
  if (removeTrailingPath) {
    // Remove trailing part containing article handle
    parts.pop()
  }
  // Remove / prefix
  parts.shift()
  parts.forEach((part) => {
    link += `/${part}`
    crumbs.push({
      link,
      text: part
    })
  })

  return crumbs
}
