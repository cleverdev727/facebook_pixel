import NacelleContentfulPreviewConnector from '@nacelle/contentful-preview-connector'

export default ({ app }) => {
  if (process.env.NACELLE_PREVIEW_MODE === 'true') {
    // Checks .env file for proper config variables
    if (!process.env.NACELLE_CMS_PREVIEW_TOKEN) {
      throw new Error(
        "Couldn't get data from your CMS. Make sure to include NACELLE_CMS_PREVIEW_TOKEN in your .env file"
      )
    }
    if (!process.env.NACELLE_CMS_PREVIEW_SPACE_ID) {
      throw new Error(
        "Couldn't get data from your CMS. Make sure to include NACELLE_CMS_PREVIEW_SPACE_ID in your .env file"
      )
    }

    // Initialize the Contentful Preview Connector
    const contentfulConnector = new NacelleContentfulPreviewConnector({
      contentfulSpaceID: process.env.NACELLE_CMS_PREVIEW_SPACE_ID,
      contentfulToken: process.env.NACELLE_CMS_PREVIEW_TOKEN
    })

    // Update the Nacelle JS SDK Data module to use preview connector
    app.$nacelle.data.update({
      connector: contentfulConnector
    })
  }
}
