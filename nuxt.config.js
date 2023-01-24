export default {
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "We're LOLA - feminine & reproductive care made by women",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'We’ve got you covered with trusted period products made with 100% organic cotton and gynecologist-approved sexual health products delivered to your door.'
      },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'MyLOLA.com'
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'MyLOLA.com'
      },
      // Facebook
      {
        name: 'facebook-domain-verification',
        content: '4co97o2g3tu6erhrfw9htlvvcrtikk'
      },
      {
        property: 'og:image',
        content:
          'https://cdn.shopify.com/s/files/1/2568/9396/files/lola_period-and-sexual-wellness-essentials.jpg?v=1623767560'
      }
    ],
    script: [
      {
        'data-kustomer-api-key':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhM2FmNzIyMjNkMWM2MDAxMThmMzUzOSIsInVzZXIiOiI1YTNhZjcyMjliMGYzYjAwMDFiYTgzMmIiLCJvcmciOiI1YTNhZjcyMTliMGYzYjAwMDFiYTgzMjUiLCJvcmdOYW1lIjoibG9sYSIsInVzZXJUeXBlIjoibWFjaGluZSIsInJvbGVzIjpbIm9yZy50cmFja2luZyJdLCJhdWQiOiJ1cm46Y29uc3VtZXIiLCJpc3MiOiJ1cm46YXBpIiwic3ViIjoiNWEzYWY3MjI5YjBmM2IwMDAxYmE4MzJiIn0.LpF8wVHIjBB0FcWTKvsuwPaJo8v7TUGikgm2LEUbRJQ',
        src: 'https://cdn.kustomerapp.com/chat-web/widget.js',
        body: true,
        async: true
      },
      {
        src: 'https://code.jquery.com/jquery-3.6.0.min.js',
        body: true,
        defer: true
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js',
        body: true,
        defer: true
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js',
        body: true,
        async: true
      },
      {
        src: `https://html2canvas.hertzen.com/dist/html2canvas.min.js`,
        body: true,
        async: true
      }
    ],
    noscript: [
      {
        innerHTML:
          '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5KJBDWM" height="0" width="0" style="display:none;visibility:hidden"></iframe>'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/global.scss'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    '~/components/lola',
    '~/components/nacelle',
    '~/components/account'
  ],

  // Add environment variables to either `publicRuntineConfig` (exposed to client)
  // or to `privateRuntimeConfig`
  // https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config/#introducing-the-nuxtjs-runtime-config
  publicRuntimeConfig: {
    API_PORT: process.env.API_PORT,
    contentAssetStorage: process.env.CONTENT_ASSET_STORAGE || '',
    nacelleId: process.env.NACELLE_SPACE_ID,
    nacelleToken: process.env.NACELLE_GRAPHQL_TOKEN,
    nacelleEndpoint: process.env.NACELLE_ENDPOINT,
    NACELLE_PREVIEW_MODE: process.env.NACELLE_PREVIEW_MODE,
    NACELLE_CMS_PREVIEW_SPACE_ID: process.env.NACELLE_CMS_PREVIEW_SPACE_ID,
    NACELLE_CMS_PREVIEW_TOKEN: process.env.NACELLE_CMS_PREVIEW_TOKEN,
    myshopifyDomain: process.env.MYSHOPIFY_DOMAIN,
    shopifyToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    iterableApiKey: process.env.ITERABLE_API_KEY,
    lolaToken: process.env.LOLA_AUTH_TOKEN,
    lolaToken2: process.env.LOLA_AUTH_TOKEN_2,
    lolaToken3: process.env.LOLA_AUTH_TOKEN_3,
    apiBaseUrl: process.env.API_BASE_URL,
    contentful: {
      accessToken: process.env.CONTENTFUL_DELIVERY_API_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      space: process.env.NACELLE_CMS_PREVIEW_SPACE_ID
    },
    donationVariantId: process.env.DONATION_SHOPIFY_VARIANT_ID
  },
  privateRuntimeConfig: { g: null },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    },
    icons: false
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxt/image',
    'nuxt-purgecss',
    '~/modules/nacelle-routes'
  ],

  image: {
    domains: ['cdn.shopify.com', 'images.ctfassets.net']
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    'nuxt-polyfill',
    '~/modules/nacelle',
    '@nuxtjs/style-resources',
    '@nacelle/nacelle-yotpo-loyalty',
    '@nacelle/nacelle-yotpo-nuxt-module',
    '@nacelle/nacelle-recharge-nuxt-module',
    'cookie-universal-nuxt'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/persist.js', mode: 'client' },
    { src: '~/plugins/nuxt-client-init.js', mode: 'client' },
    { src: '~/plugins/script-loader.js', mode: 'client' },
    { src: '~/plugins/integrations/ga.js', mode: 'client' },
    { src: '~/plugins/contentful-preview', mode: 'client' },
    { src: '~/plugins/calendar.js', mode: 'client' },
    { src: '~/plugins/tooltip.js', mode: 'client' },
    { src: '~/plugins/contentful.js' },
    { src: '~/plugins/integrations/pixel.js', mode: 'client' }
  ],

  env: {
    NACELLE_CMS_PREVIEW_SPACE_ID: process.env.NACELLE_CMS_PREVIEW_SPACE_ID,
    NACELLE_CMS_PREVIEW_TOKEN: process.env.NACELLE_CMS_PREVIEW_TOKEN,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    GTM_CODE: process.env.GTM_CODE
  },

  /*
   ** Nacelle Configuration
   * https://docs.getnacelle.com/nuxt/nuxt-config.html
   */
  nacelle: {
    spaceID: process.env.NACELLE_SPACE_ID,
    token: process.env.NACELLE_GRAPHQL_TOKEN,
    endpoint: process.env.NACELLE_ENDPOINT,
    yotpoAPIKey: process.env.YOTPO_API_KEY,
    yotpoGUID: process.env.YOTPO_GUID,
    gaID: process.env.GA_TRACKING_ID,

    /* Optional */
    // Set the default internationalization locales string for Nacelle to use
    defaultLocale: 'en-US',

    // Optional array of data type strings to direct Nacelle to include other data types
    // besides products in search data.
    searchDataTypes: ['article', 'blog']
  },

  generate: {
    crawler: false,
    concurrency: 25
  },

  polyfill: {
    features: [
      {
        require: 'intersection-observer',
        detect: () => 'IntersectionObserver' in window
      }
    ]
  },

  styleResources: {
    scss: ['~/assets/scss/base/_variables.scss']
  },

  // Customize the progress-bar color
  loading: { color: '#fff' },

  router: {
    middleware: 'cart'
  },

  sitemap: {
    gzip: true,
    hostname: 'https://mylola.com' // When deploying, change this to your production URL
  },

  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
      config.node = {
        Buffer: true
      }
    },
    extractCSS: true,
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    }
  }
}
