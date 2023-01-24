<template>
  <section
    class="points"
    style="height: calc(400vh + 50px); position: relative"
  >
    <div id="animated-cards-1" class="animated-cards">
      <div class="card">
        <div
          class="card__background"
          style="background-size: cover; z-index: -1; opacity: 1"
        ></div>
        <div class="container mx-auto flex flex--items-center">
          <section class="callout">
            <h4 class="text--primary text--uppercase text--bold">
              HI, WE'RE LOLA
            </h4>
            <h2>
              Founded by women with sky-high standards, we make period and
              sexual wellness products with you in mind. No mystery ingredients.
              So many ways to customize.
            </h2>
            <a href="#bestsellers" class="text--no-decoration">
              Shop our bestsellers &nbsp;
              <arrow-right />
            </a>
          </section>
        </div>
      </div>
      <div class="card">
        <div
          class="card__background"
          style="background-color: #4e6282; background-size: cover; opacity: 1"
        ></div>
        <div class="content" style="transform: translateX(-466.963px)">
          <div>
            <div class="grid">
              <div class="img-container" style="background-color: #4e6282">
                <nuxt-img
                  src="https://cdn.shopify.com/s/files/1/2660/3696/files/STILL_LIFE_SHOT_09-019-FINAL-V1_2x_8d4707c2-7b1f-43d9-a03c-d219bf145db7.png?v=1594823973"
                  alt="Quality ingredients image"
                />
              </div>
              <div class="text-content text--center text--white">
                <span class="counter">1 / 3</span>
                <h2 class="mb-0 text--bold">Quality ingredients</h2>
                <div>
                  We’re always upfront, even on the back of the box. No toxins
                  or dyes, ever. If it’s going in your body, you should know
                  what it’s made of.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div
          class="card__background"
          style="
            background-color: #4e6282;
            background-size: cover;
            opacity: 0.25;
          "
        ></div>
        <div class="content" style="transform: translateX(973.037px)">
          <div>
            <div class="grid">
              <div class="img-container" style="background-color: #6e8db1">
                <nuxt-img
                  src="https://cdn.shopify.com/s/files/1/2660/3696/files/LOLARiveterMinneapolis100919_073_edited_2x_5888a72a-1ae9-463c-b504-9ed978b6ff35.png?v=1594823973"
                  alt="Trusted resources image"
                />
              </div>
              <div class="text-content text--center text--white">
                <span class="counter">2 / 3</span>
                <h2 class="mb-0 text--bold">Trusted resources</h2>
                <div>
                  Our collective of experts has you covered. Find answers to all
                  of the reproductive health questions that keep you up at
                  night.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div
          class="card__background"
          style="background-size: cover; background-color: #4e6282; opacity: 0"
        ></div>
        <div class="content" style="transform: translateX(2413.04px)">
          <div>
            <div class="grid">
              <div class="img-container" style="background-color: #d2dfea">
                <nuxt-img
                  src="https://cdn.shopify.com/s/files/1/2660/3696/files/D03_7368_2x_8d68018f-8679-4d09-9834-95b06d79381a.png?v=1594823973"
                  alt=""
                />
              </div>
              <div class="text-content text--center text--white">
                <span class="counter">3 / 3</span>
                <h2 class="mb-0 text--bold">On a mission</h2>
                <div>
                  Giving back is in our DNA. We’ve donated over 6 million
                  products to those in need, and continue to fight for
                  reproductive equity.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArrowRight from '@/components/lola/icons/ArrowRight'

export default {
  components: {
    ArrowRight
  },
  mounted() {
    this.container = document.getElementById('animated-cards-1')
    this.parentElement = this.container.parentElement
    this.cards = this.parentElement.querySelectorAll('.card')
    this.cardsLength = this.cards.length
    this.containerTop = this.getTopOffset()
    this.cardOpacities = []
    this.screenHeight = window.innerHeight
    this.screenWidth = window.innerWidth
    this.topValueSet = false
    this.parentElement.style.height = `calc(${this.cardsLength * 100}vh + 50px`
    this.parentElement.style.position = 'relative'
    this.begin()
  },
  methods: {
    begin() {
      document.addEventListener('scroll', () => {
        this.handleBodyScroll()
      })
    },

    bezierBlend(t) {
      return t * t * (3.0 - 2.0 * t)
    },

    getOpacity(index) {
      const opacity = this.cardOpacities[index] || 0
      const bezierValue = this.bezierBlend(opacity)
      return this.round(bezierValue, 2)
    },

    getTranslateDistance(index) {
      const ratio = this.cardOpacities[this.activeIndex] || 0
      const multiplier = index - this.activeIndex + 1
      const subtractor = multiplier * this.screenWidth
      const translateDistance = subtractor - this.screenWidth * ratio

      return `translateX(${translateDistance}px)`
    },

    getTopOffset() {
      const clientTop = this.container.getBoundingClientRect().top
      const scrollY = window.scrollY
      return clientTop + scrollY
    },

    handleBodyScroll() {
      const totalTopOffset = this.getTopOffset()
      if (totalTopOffset > scrollY && !this.topValueSet) {
        this.containerTop = totalTopOffset
        this.topValueSet = true
      }
      if (
        !this.inView(
          this.screenHeight,
          this.containerTop,
          scrollY,
          this.cardsLength
        )
      ) {
        return
      }
      const heightDifference = scrollY - this.containerTop
      let subtraction, ratio

      if (heightDifference <= 0) {
        subtraction = this.screenHeight + heightDifference
        this.activeIndex = 0
        ratio = subtraction / this.screenHeight
        this.cardOpacities[this.activeIndex] = this.round(ratio, 5)
      } else {
        ratio = heightDifference / this.screenHeight
        const activeIndex = Math.floor(ratio)
        if (activeIndex >= this.cardsLength - 1) {
          return
        }
        this.activeIndex = activeIndex + 1
        this.cardOpacities[this.activeIndex] = this.round(
          ratio - activeIndex,
          5
        )
      }
      requestAnimationFrame(() => {
        this.cards.forEach((card, index) => {
          const background = card.querySelector('.card__background')
          const content = card.querySelector('.content')
          const opacity = this.getOpacity(index)
          background.style.opacity = opacity
          content &&
            (content.style.transform = this.getTranslateDistance(index))

          if (this.activeIndex === 0) {
            this.cards[0].classList.add('active')
          }

          if (this.activeIndex === 1) {
            if (this.getOpacity(this.activeIndex) > 0.4) {
              this.cards[0].classList.remove('active')
            } else {
              this.cards[0].classList.add('active')
            }
          }
        })
      })
    },

    inView(screenHeight, containerTop, scrollY, length) {
      const firstCondition = scrollY + screenHeight >= containerTop
      const totalHeightValue = containerTop + screenHeight * length
      const secondCondition = scrollY <= totalHeightValue

      return firstCondition && secondCondition
    },

    round(value, precision) {
      return parseFloat(value.toFixed(precision))
    }
  }
}
</script>

<style lang="scss" scoped>
.animated-cards {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;

  .card {
    display: flex;
    position: absolute;
    background-size: cover;
    height: 100vh;
    width: 100vw;
    z-index: 1;

    &.active {
      z-index: 4;
    }

    &__background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  .callout {
    width: 730px;
    max-width: 100%;

    .text--primary {
      margin-bottom: 22px;
    }

    a {
      font-size: 14px;
      margin-right: 10px;
    }
  }

  .grid {
    display: grid;
    grid-gap: 28px;
    grid-template-columns: repeat(2, 1fr);
  }

  .content {
    h1,
    h2 {
      margin-bottom: 15px;
    }
  }
}

@media screen and (max-width: 600px) {
  .callout {
    padding: 0 16px;
  }
  .points {
    display: flex;
    flex-direction: column;

    .grid {
      display: flex;
      flex-direction: column;
      margin-left: 60px;
      margin-right: 60px;
    }
  }
}

.points {
  margin-top: 160px;
  @media screen and (max-width: 959px) {
    margin-top: 0;
  }

  .card .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 740px;
    max-width: 100%;
    margin: 0 auto;
    color: #fff;
    z-index: 1;
    text-align: center;

    h1 {
      margin-bottom: 10px;
    }
  }

  .img-container {
    position: relative;
    padding: 0 24px;
    background-color: #4e6282;
    margin-bottom: 48px;
  }

  img {
    display: block;
    transform: translateY(24px);
    max-width: 100%;
    margin: 0;
  }

  .text-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

@media screen and (max-width: 959px) {
  .points .card > .container {
    transition: all 1s linear;
    position: absolute;
    width: 100%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .points .card.active > .container {
    transform: translate(-50%, 0);
    top: 0;
  }
}
</style>
