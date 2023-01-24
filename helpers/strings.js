export const pluralize = (string, quantity = 0) => {
  if (quantity < 2) {
    return string
  }

  const length = string.length
  const lastChar = string.substring(length - 1)
  const suffixes = {
    y: 'ies',
    i: 'ies',
    o: 'oes',
    x: 'xes',
    s: 'ses'
  }

  const suffix = suffixes[lastChar] || lastChar + 's'
  const regex = new RegExp(`${lastChar}$`)
  string = string.replace(regex, suffix)
  return string
}

export const normalizeImageUrl = (url) => {
  if (!url) return ''
  try {
    const result = url.startsWith('//') ? `https:${url}` : url
    return result
  } catch (error) {
    console.error(error)
  }
}

export const stripHtml = (str = '') => {
  const element = document.createElement('div')
  return element.textContent
}

// window & document aren't available server-side.
// Therefore, this function uses regex for stripping
// HTML tags from any string content
export const stripHtmlSsr = (str) => {
  str = str || ''
  return str.replace(/(<([^>]+)>)/gi, '')
}
