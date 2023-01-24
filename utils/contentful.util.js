import { normalizeImageUrl } from '~/helpers/strings'

export const getFlattenedFeaturedMedia = (data) => {
  const { fields, id, src, altText } = data

  if (id && src) {
    // data has structure -> {id: string, src: string, altText: string?}
    return { url: src, alt: altText }
  }

  // fields has the structure -> {file: {url: string}, title: string?, description: string?}
  const { file, description, title } = fields || {}
  if (!file) {
    return {
      url: '',
      alt: ''
    }
  }

  return {
    url: file.url,
    alt: description || title
  }
}

export const getNormalizedFeaturedMedia = (data) => {
  const { url, alt } = getFlattenedFeaturedMedia(data)
  return { alt, url: normalizeImageUrl(url) }
}

export const buildArticlesAndTags = (list = []) => {
  const articlesObj = {}
  const tagsObj = {}

  list.forEach((article) => {
    const tags = article.tags || []
    if (!articlesObj.all) {
      articlesObj.all = []
    }

    articlesObj.all.push(article)

    tags.forEach((tag) => {
      tag = tag.replace(' ', '-').toLowerCase()
      tagsObj[tag] = tag

      if (!articlesObj[tag]) {
        articlesObj[tag] = []
      }

      articlesObj[tag].push(article)
    })
  })

  return { articles: articlesObj, tags: Object.keys(articlesObj) }
}
