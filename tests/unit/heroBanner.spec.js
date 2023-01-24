import { mount } from '@vue/test-utils'
import LolaHeroBanner from '@/components/lola/LolaHeroBanner.vue'
import Block from '@/components/lola/hero-types/Block.vue'
import MultiImage from '@/components/lola/hero-types/MultiImage.vue'
import FullBleed from '@/components/lola/hero-types/FullBleed.vue'

const primaryDesktopRelativeImageUrl =
  '//images.ctfassets.net/acnkdcy3dwsy/6n5O36jzcriObGCfPU8M2d/3e5fea03c58f2ab1f74786a55eea86ee/Lola-Organic-Desktop.jpeg'

const commonProps = {
  backgroundColor: '#6E8DB1',
  primaryMobileImage: {
    metadata: {
      tags: []
    },
    sys: {
      createdAt: '2021-05-04T20:13:34.505Z',
      environment: {
        sys: {
          linkType: 'Environment',
          id: 'staging',
          type: 'Link'
        }
      },
      id: '1apAT7z7LsFr0C3Cmt63QM',
      type: 'Asset',
      locale: 'en-US',
      space: {
        sys: {
          linkType: 'Space',
          id: 'acnkdcy3dwsy',
          type: 'Link'
        }
      },
      updatedAt: '2021-05-04T20:13:34.505Z',
      revision: 1
    },
    fields: {
      file: {
        fileName: 'Lola-Organic-Mobile.jpeg',
        details: {
          image: {
            width: 750,
            height: 896
          },
          size: 69667
        },
        contentType: 'image/jpeg',
        url: '//images.ctfassets.net/acnkdcy3dwsy/1apAT7z7LsFr0C3Cmt63QM/557eab3589205a6725ffe0bc036a9a3b/Lola-Organic-Mobile.jpeg'
      },
      title: 'Organic Bathroom Counter - Mobile (hero)'
    }
  },
  supportTextDesktop:
    'Period and sex essentials made with natural ingredients.',
  mainTextDesktop: 'Clean up your routine.',
  heroType: 'Block',
  // supportTextMobile: 'Period and sex essentials made with natural ingredients.',
  primaryCtaUrl: '/collections',
  textColor: '#fff',
  primaryCtaText: 'Shop now',
  primaryDesktopImage: {
    metadata: {
      tags: []
    },
    sys: {
      createdAt: '2021-05-04T20:11:50.705Z',
      environment: {
        sys: {
          linkType: 'Environment',
          id: 'staging',
          type: 'Link'
        }
      },
      id: '6n5O36jzcriObGCfPU8M2d',
      type: 'Asset',
      locale: 'en-US',
      space: {
        sys: {
          linkType: 'Space',
          id: 'acnkdcy3dwsy',
          type: 'Link'
        }
      },
      updatedAt: '2021-05-04T20:11:50.705Z',
      revision: 1
    },
    fields: {
      file: {
        fileName: 'Lola-Organic-Desktop.jpeg',
        details: {
          image: {
            width: 2560,
            height: 1218
          },
          size: 209127
        },
        contentType: 'image/jpeg',
        url: primaryDesktopRelativeImageUrl
      },
      title: 'Organic Bathroom Counter - Desktop (Hero)'
    }
  },
  mainTextMobile: 'Clean up your routine.',
  textAlignment: 'Left',
  name: 'Left block banner',
  blockAlignment: 'Left'
}

describe('LolaHeroBanner.vue', () => {
  const wrapper = mount(LolaHeroBanner, {
    propsData: { ...commonProps },
    stubs: ['nuxt-link']
  })

  it('renders a hero banner', () => {
    expect(wrapper.classes()).toContain('lola-hero-banner')
    expect(wrapper.findComponent(Block).exists()).toBe(true)
  })

  it('renders an H1 with the main text', () => {
    const mainTextDesktop = wrapper.find('h1.main-text')
    expect(mainTextDesktop.exists()).toBe(true)
    expect(mainTextDesktop.text()).toBe(commonProps.mainTextDesktop)
  })

  it('renders a primary CTA', () => {
    const primaryCta = wrapper.find('.ctas .primary-cta .button')
    expect(primaryCta.exists()).toBe(true)
    expect(primaryCta.text()).toBe(commonProps.primaryCtaText)
  })

  it('renders mobile texts with the content of their desktop versions when not provided', async () => {
    expect(wrapper.vm.componentFields.supportTextMobile).toBe(
      commonProps.supportTextDesktop
    )
    wrapper.setProps({ mainTextMobile: null })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.componentFields.mainTextMobile).toBe(
      commonProps.mainTextDesktop
    )
  })

  it("renders a secondary CTA when it's available", () => {
    const props = {
      ...commonProps,
      secondaryCtaText: 'Visit our blog',
      secondaryCtaUrl: '/blog'
    }
    const wrapper = mount(LolaHeroBanner, {
      propsData: props,
      stubs: ['nuxt-link']
    })
    const secondaryCta = wrapper.find('.ctas .secondary-cta .button')
    expect(secondaryCta.exists()).toBe(true)
    expect(secondaryCta.text()).toBe(props.secondaryCtaText)
  })

  describe('Left Block banner', () => {
    const blockWrapper = wrapper.findComponent(Block)

    it('renders a hero banner with text block on the left', async () => {
      expect(blockWrapper.classes()).toContain('left-block')
      expect(blockWrapper.vm.flexAlignment).toBe('start')

      wrapper.setProps({ textAlignment: 'Center' })
      await wrapper.vm.$nextTick()

      expect(blockWrapper.vm.flexAlignment).toBe('center')
    })
  })

  describe('Right Block banner', () => {
    const wrapper = mount(LolaHeroBanner, {
      propsData: {
        ...commonProps,
        blockAlignment: 'Right',
        textAlignment: 'Right'
      },
      stubs: ['nuxt-link']
    })
    const blockWrapper = wrapper.findComponent(Block)

    it('renders a hero banner with text block on the right', () => {
      expect(blockWrapper.classes()).toContain('right-block')
      expect(blockWrapper.vm.flexAlignment).toBe('end')
    })
  })

  describe('Multi-image banner', () => {
    const propsData = {
      ...commonProps,
      heroType: 'multi-image',
      secondaryDesktopImage: {
        fields: {
          file: {
            url: '//images.ctfassets.net/acnkdcy3dwsy/5vJMsLFLZJElNz1nhJYLBs/f31254a5203e6a21902b233db1d84a9e/Sexual-Wellness_Periods_Mobile_Hero__1_.jpg'
          },
          title: 'Sexual-Wellness Periods Mobile Hero (1)'
        }
      }
    }

    const wrapper = mount(LolaHeroBanner, {
      propsData,
      stubs: ['nuxt-link']
    })
    const multiImageWrapper = wrapper.findComponent(MultiImage)

    it('renders a hero banner with primary (left) and secondary (right) images', () => {
      expect(multiImageWrapper.exists()).toBe(true)
      const secondaryImage = multiImageWrapper.find('.secondary-image')
      expect(secondaryImage.exists()).toBe(true)
    })

    it('uses desktop image when mobile is not available', () => {
      const { primaryMobileImage, ...rest } = propsData
      const wrapper = mount(LolaHeroBanner, {
        propsData: rest,
        stubs: ['nuxt-link']
      })
      const multiImageWrapper = wrapper.findComponent(MultiImage)

      expect(multiImageWrapper.vm.images.primary.mobile).toBe(
        multiImageWrapper.vm.images.primary.desktop
      )
    })
  })

  describe('Full-bleed banner', () => {
    const wrapper = mount(LolaHeroBanner, {
      propsData: {
        ...commonProps,
        heroType: 'full bleed'
      },
      stubs: ['nuxt-link']
    })
    const fullBleedWrapper = wrapper.findComponent(FullBleed)

    it('renders a full bleed banner', () => {
      expect(fullBleedWrapper.exists()).toBe(true)
      const secondaryImage = fullBleedWrapper.find('.full-bleed')
      expect(secondaryImage.exists()).toBe(true)
    })
  })
})
