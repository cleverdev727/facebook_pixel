import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContentHeroBanner from '@/components/nacelle/ContentHeroBanner'
import Vuex from 'vuex'

import storeConfig from '@/tests/storeConfig'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store(storeConfig())

const defaults = {
  featuredMedia: {
    fields: {
      file: {
        url: '//images.ctfassets.net/acnkdcy3dwsy/3PcLqvhplGDOJ1ErlD6AQM/d5d34f5f63530bcb9a758b08dfe71c3b/0221_HomepageHero_Desktop_R2.jpeg'
      }
    }
  },
  alignment: 'center',
  mobileFullHeight: true,
  mobileBackgroundImage: {
    fields: {
      file: {
        url: '//images.ctfassets.net/acnkdcy3dwsy/4FZuX1sSkQguoZewy4iOi2/29a5f0a658cef571bdd55f1e17908047/0221_HomepageHero_Mobile_R2__1_.jpeg'
      }
    }
  },
  title: 'Refresh and balance.',
  subtitle:
    'New, pH-balanced formulas that work with your body’s natural state.',
  ctaTargetId: '',
  ctaText: 'Shop Vaginal Health',
  ctaUrl: '/collections'
}

const wrapperDefault = shallowMount(ContentHeroBanner, {
  store,
  stubs: ['nuxt-link'],
  localVue,
  propsData: { ...defaults }
})

const wrapperFullheight = shallowMount(ContentHeroBanner, {
  store,
  stubs: ['nuxt-link'],
  localVue,
  propsData: { ...defaults, size: 'large' }
})

describe('ContentHeroBanner.vue', () => {
  it('renders a banner', () => {
    expect(wrapperDefault.find('.hero-section-desktop').exists()).toBe(true)
  })

  it('is size medium by default', () => {
    expect(wrapperDefault.find('.is-medium').exists()).toBe(true)
  })

  it('is large when supplied "large" size prop', () => {
    expect(wrapperFullheight.find('.is-large').exists()).toBe(true)
  })

  it('has a /collections cta', () => {
    expect(wrapperDefault.html()).toContain('to="/collections"')
  })
})
