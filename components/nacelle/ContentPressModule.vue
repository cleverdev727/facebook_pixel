<template>
  <div class="container mx-auto">
    <section id="press-quotes-1" class="press-quotes mx-auto">
      <div>
        <div class="quotes">
          <h2
            v-for="(_content, index) in content"
            :key="_content.id"
            class="quote text--center mb-0"
            :class="index === 0 ? 'active' : ''"
          >
            {{ _content.fields.bodyText }}
          </h2>
        </div>
        <div class="logos">
          <nuxt-img
            v-for="(_content, index) in content"
            :key="_content.id"
            :alt="
              _content.fields.iconImage.fields.description ||
              _content.fields.iconImage.fields.title
            "
            :src="sanitizeImageUrl(_content.fields.iconImage.fields.file.url)"
            :class="index === 0 ? 'active' : ''"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import commonMixins from '~/mixins/commonMixins'
export default {
  mixins: [commonMixins],
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted() {
    this.parentElement = document.getElementById('press-quotes-1')
    this.logos = this.parentElement.querySelectorAll('.logos img')
    this.quotes = this.parentElement.querySelectorAll('.quote')
    this.init()
  },
  methods: {
    init() {
      this.logos.forEach((logo, index) => {
        if (index > 0) {
          this.quotes[index].style.opacity = 0
        }
        logo.addEventListener('click', () => {
          requestAnimationFrame(() => this.switchQuotes(index))
        })
        logo.addEventListener('mouseover', () =>
          requestAnimationFrame(() => this.switchQuotes(index))
        )
      })
    },

    hideQuote(quote) {
      quote.classList.remove('active')
      quote.style.opacity = 0
    },

    showQuote(quote) {
      quote.classList.add('active')
      setTimeout(() => {
        quote.style.opacity = 1
      }, 0)
    },

    switchQuotes(index) {
      this.logos.forEach((_logo, _index) => {
        const quote = this.quotes[_index]
        _index === index
          ? _logo.classList.add('active') || this.showQuote(quote)
          : _logo.classList.remove('active') || this.hideQuote(quote)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.press-quotes {
  padding: 120px 0;
  width: 740px;
  max-width: 100%;

  .logos {
    margin-top: 60px;
    display: grid;
    grid-auto-columns: auto;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;

    img {
      opacity: 0.35;
      margin: 0;
      max-width: 100%;

      &.active {
        opacity: 1;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  .quote {
    display: none;
    visibility: hidden;
    transition: all ease-in 0.25s;

    &.active {
      display: block;
      visibility: visible;
    }
  }
}
@media screen and (max-width: 600px) {
  .press-quotes {
    padding: 80px 16px;

    .logos {
      gap: 18px;
    }
  }
}
</style>
