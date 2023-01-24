<template>
  <div class="slideshow-container lola-simple-gallery">
    <h2 v-if="title" class="title text--center">{{ title }}</h2>
    <div class="side-by-side">
      <div class="showcase">
        <div class="big">
          <div class="slideshow-images">
            <div
              v-for="(image, index) in content.images"
              :key="index"
              class="s-img"
            >
              <nuxt-img :src="image.src" :alt="image.alt" />
            </div>
          </div>
          <div class="slide-btns flex justify--space-between full-width">
            <span class="ar-left rotate-180">
              <chevron-right />
            </span>
            <span class="ar-right">
              <chevron-right />
            </span>
          </div>
        </div>
        <div class="content lola-simple-gallery flex flex--items-center">
          <div class="section__entries">
            <div class="entries__container">
              <div
                v-for="(slide, index) in content.slides"
                :key="index"
                class="section__entry"
                :class="{ 'active-entry': index === activeIndex }"
              >
                <div class="flex flex--column text--center">
                  <h2>{{ slide.title }}</h2>
                  <article v-html="slide.body"></article>
                  <nuxt-link
                    :to="slide.ctaUrl || ''"
                    class="button cta self-auto"
                  >
                    {{ slide.ctaText }}
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleGallery from '@/lib/simple-gallery'
import ChevronRight from '@/components/lola/icons/ChevronRight.vue'
export default {
  components: { ChevronRight },
  props: {
    panes: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    activeIndex() {
      return 0
    },
    content() {
      const data = {
        images: [],
        slides: []
      }

      this.panes.forEach((pane) => {
        const { mediaImageOrVideo, ...slide } = pane.fields
        const {
          file,
          description,
          title: slideTitle
        } = mediaImageOrVideo.fields
        data.slides.push(slide)
        data.images.push({
          description: description || slideTitle,
          src: file.url.startsWith('//') ? `https:${file.url}` : file.url
        })
      })

      return data
    }
  },
  mounted() {
    const section = this.$el
    const container = section.querySelector(
      '.section__entries .entries__container'
    )

    try {
      const sg = new SimpleGallery(container).showDots().autoRun(false)

      window.$('.slideshow-images').slick({
        dots: 'true',
        nextArrow: window.$('.ar-right'),
        prevArrow: window.$('.ar-left')
      })

      window
        .$('.slideshow-images')
        .on('beforeChange', (event, slick, currentSlide, nextSlide) => {
          const { slideCount } = slick
          let direction = 'left'

          if (currentSlide < nextSlide) {
            if (currentSlide === 0 && nextSlide === slideCount - 1) {
              direction = 'left'
            } else direction = 'right'
          } else if (currentSlide === slideCount - 1 && nextSlide === 0) {
            direction = 'right'
          } else direction = 'left'

          direction === 'left' ? sg.prev() : sg.next()
        })
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.slideshow-container {
  > .title {
    margin-top: 24px;
  }

  .section__entry {
    > div {
      margin: 0 auto;
      max-width: 300px;
    }

    .cta {
      margin-top: 24px;
    }
  }

  .big {
    position: relative;
  }
  .slide-btns {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;

    > span {
      padding: 0 4%;
      cursor: pointer;

      svg {
        width: 12px;
        height: 20px;
      }
    }
  }
  .s-img img {
    width: 100%;
  }

  @media screen and (max-width: $medium-screen) {
    .showcase {
      padding: 20px 0;

      .content {
        padding-top: 48px;
      }
    }
  }
}
</style>
