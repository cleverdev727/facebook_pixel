import { createClient } from 'contentful'
import NacelleClient from '@nacelle/client-js-sdk'

// Nacelle
let nacelleClient
let nacelleConfig

// Contentful
let contentfulClient
let contentfulConfig

const getNacelleClient = (config) => {
  if (!nacelleClient) {
    const nacelleConfig = config || getNacelleConfig()
    nacelleClient = new NacelleClient(nacelleConfig)
  }

  return nacelleClient
}

const getNacelleConfig = () => {
  if (!nacelleConfig) {
    const spaceID = process.env.NACELLE_SPACE_ID
    const token = process.env.NACELLE_GRAPHQL_TOKEN
    const endpoint = process.env.NACELLE_ENDPOINT
    nacelleConfig = {
      id: spaceID,
      token,
      nacelleEndpoint: endpoint,
      useStatic: false
    }
  }

  return nacelleConfig
}

const getContentfulClient = (config) => {
  if (!contentfulClient) {
    const contentfulConfig = config || getContentfulConfig()
    contentfulClient = createClient(contentfulConfig)
  }

  return contentfulClient
}

const getContentfulConfig = () => {
  if (!contentfulConfig) {
    const space = process.env.NACELLE_CMS_PREVIEW_SPACE_ID
    const accessToken = process.env.CONTENTFUL_DELIVERY_API_TOKEN
    const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master'
    contentfulConfig = {
      space,
      accessToken,
      environment
    }
  }

  return contentfulConfig
}

export const getClient = (service) => {
  const clients = {
    contentful: getContentfulClient,
    nacelle: getNacelleClient
  }

  return clients[service]
}

export const getConfig = (service) => {
  const configs = {
    contentful: getContentfulConfig,
    nacelle: getNacelleConfig
  }

  return configs[service]()
}
