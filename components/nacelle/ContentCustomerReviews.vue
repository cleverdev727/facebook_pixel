<template>
  <div id="quotes-1" class="quotes">
    <div class="lola-simple-gallery">
      <div class="section__entries">
        <div class="entries__container" style="width: 400%">
          <div
            v-for="_review in review"
            :key="_review.id"
            class="section__entry"
            style="max-width: 25%; margin-left: 0px"
          >
            <p>{{ _review.fields.reviewContent }}</p>
            <span class="name text--uppercase"
              >- {{ _review.fields.customerName }}</span
            >
          </div>
        </div>
        <div class="dots">
          <div v-for="_review in review" :key="_review.id" class="dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    review: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted() {
    this.container = this.$el.querySelector(
      '.section__entries .entries__container'
    )
    // Set default values
    this._interval = 5000
    this.currentIndex = 0
    this.autoSlide = true
    this.entries = this.container.querySelectorAll('.section__entry')
    if (this.entries.length > 1) {
      setTimeout(() => {
        this.init()
      }, 0)
    }
  },
  methods: {
    getEntryMaxSize() {
      return `${100 / this.entries.length}%`
    },

    highlightDot(currentIndex, direction = 'right') {
      let newIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1
      if (newIndex >= this.entries.length) {
        newIndex = 0
      }

      if (newIndex < 0) {
        newIndex = this.entries.length - 1
      }

      const dots = this.container.parentElement.querySelectorAll('.dots .dot')
      dots.forEach((dot, index) => {
        index === newIndex
          ? dot.classList.add('active')
          : dot.classList.remove('active')
      })

      this.currentIndex = newIndex
      return this
    },

    init() {
      this.container.style.width = `${this.entries.length * 100}%`
      this.entries.forEach((entry) => {
        entry.style.maxWidth = this.getEntryMaxSize()
      })

      if (this.autoSlide) {
        setInterval(() => {
          this.move()
        }, this._interval)
      }

      return this
    },

    next() {
      this.move('right')
      return this
    },

    prev() {
      this.move('left')
      return this
    },

    setInterval(interval) {
      this._interval = interval
      return this
    },

    move(direction = 'right') {
      const sectionEntries = this.container.querySelectorAll('.section__entry')
      const length = sectionEntries.length
      const firstItem = sectionEntries[0]
      const lastItem = sectionEntries[length - 1]
      const activeEntry = this.container.querySelector(
        '.section__entry.active-entry'
      )
      const leftMarginPercentage = '-' + this.getEntryMaxSize() // Negative value needed

      if (direction === 'right') {
        firstItem.style.marginLeft = leftMarginPercentage
        const timeout = Math.min(this._interval, 400)
        setTimeout(() => {
          this.container.removeChild(firstItem)
          firstItem.classList.remove('active-entry')
          firstItem.style.marginLeft = 0
          this.container.appendChild(firstItem)
          sectionEntries[1].classList.add('active-entry')
        }, timeout)

        this.highlightDot(this.currentIndex, 'right')
      } else {
        this.container.removeChild(lastItem)
        lastItem.style.marginLeft = leftMarginPercentage
        this.container.insertBefore(lastItem, firstItem)
        setTimeout(() => {
          lastItem.style.marginLeft = 0
          activeEntry.classList.remove('active-entry')
          lastItem.classList.add('active-entry')
        }, 10)

        this.highlightDot(this.currentIndex, 'left')
      }

      return this
    }
  }
}
</script>

<style lang="scss" scoped>
.quotes {
  @media (min-width: 600px) {
    height: 200px;
  }
  height: 130px;

  .section__entries {
    width: 740px;
    max-width: 90%;
    margin: 0 auto;
    overflow-x: hidden;

    .dots {
      margin-top: 48px;
      width: auto;

      .dot {
        background-color: #514945;
        opacity: 0.4;
        border: none;
        margin-right: 28px;

        &:last-of-type {
          margin: 0;
        }

        &.active {
          opacity: 1;
        }
      }
    }
  }
  .section__entry {
    p {
      font-size: 36px;
      line-height: 48px;
      margin: 0;
    }

    .name {
      display: block;
      font-size: 14px;
      font-weight: bold;
      color: #4e6282;
      margin-top: 24px;
    }
  }
}

@media screen and (max-width: 600px) {
  .quotes {
    .section__entry {
      p {
        font-size: 28px;
        line-height: 36px;
      }
    }
  }
}

.lola-simple-gallery {
  .section__entries {
    margin: 0 auto;
    overflow-x: hidden;
  }
  .entries__container {
    display: flex;

    .section__entry {
      text-align: center;
      font-size: 20px;
      line-height: 1.5;
      width: 100%;
      -webkit-transition: all 0.4s ease-in-out;
      transition: all 0.4s ease-in-out;

      .ratings svg {
        width: 14px;
        height: 14px;

        &:not(:last-of-type) {
          margin-right: 8px;
        }
      }
    }
  }

  .dots {
    margin: 0 auto;
    width: 60px;
    display: flex;
    justify-content: center;
    margin-top: 30px;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid #4e6282;
      margin-right: 4px;

      &.active {
        background-color: #4e6282 !important;
      }
    }
  }
}
</style>
