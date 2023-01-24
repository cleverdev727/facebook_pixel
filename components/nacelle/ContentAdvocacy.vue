<template>
  <section
    class="advocacy"
    style="height: calc(400vh + 50px); position: relative"
  >
    <div id="animated-cards-2" class="animated-cards">
      <div class="card">
        <div
          class="card__background"
          style="background-size: cover; z-index: -1; opacity: 1"
        ></div>
        <div class="container mx-auto flex flex--items-center">
          <section class="callout">
            <h4 class="text--primary text--uppercase text--bold">
              WHAT DRIVES US
            </h4>
            <h2>
              We believe reproductive care should be safe and accessible for
              everyone. We’re dedicated to making that a reality.
            </h2>
          </section>
        </div>
      </div>
      <div class="card">
        <div
          class="card__background"
          style="background-color: #759ba4; background-size: cover; opacity: 1"
        ></div>
        <div class="content" style="transform: translateX(155.765px)">
          <span class="counter">1 / 3</span>
          <h1>Advocating for change</h1>
          <div>
            <p>
              In 2019, we launched a national campaign with Period Equity to put
              an end to the discriminatory tampon tax. We continue to amplify
              the voices of policy makers, raise awareness, and challenge the
              status quo.
            </p>
          </div>
        </div>
      </div>
      <div class="card">
        <div
          class="card__background"
          style="background-color: #2c3a3d; background-size: cover; opacity: 0"
        ></div>
        <div class="content" style="transform: translateX(1595.76px)">
          <span class="counter">2 / 3</span>
          <h1>Setting a new standard</h1>
          <div>
            <p>
              We strive for full transparency in all that we do. From our
              ingredient lists to our candid conversations about periods and
              sex, we always tell it like it is.
            </p>
          </div>
        </div>
      </div>
      <div class="card">
        <div
          class="card__background"
          style="background-color: #4e676d; background-size: cover; opacity: 0"
        ></div>
        <div class="content" style="transform: translateX(3035.76px)">
          <span class="counter">3 / 3</span>
          <h1>Investing in the future</h1>
          <div>
            <p>
              We’re dedicated to shining a light on the racial and social
              disparities that contribute to reproductive inequity. And we’re
              working to fight these injustices, together.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    this.container = document.getElementById('animated-cards-2')
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
.advocacy {
  margin-top: 160px;

  .card .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
    color: #fff;
    z-index: 1;
    text-align: center;

    h1 {
      margin-bottom: 10px;
    }
  }
}

@media screen and (max-width: 600px) {
  .advocacy {
    .card {
      .content {
        margin: 0 60px;
      }
    }
  }
}

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
}
</style>
