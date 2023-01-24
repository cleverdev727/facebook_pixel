import { createClient } from 'contentful'

export default function ({ $config }, inject) {
  const contentfulOptions = $config.contentful
  const client = createClient(contentfulOptions)
  const previewClient = createClient({
    ...contentfulOptions,
    accessToken: $config.NACELLE_CMS_PREVIEW_TOKEN,
    host: 'preview.contentful.com'
  })
  inject('contentful', client)
  inject('preview', previewClient)
}
