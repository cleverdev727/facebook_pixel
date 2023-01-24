<template>
  <div class="container mx-auto">
    <section class="categories grid">
      <div v-for="card in cards" :key="card.id" class="pane">
        <nuxt-link :to="'/collections/' + card.fields.collectionHandle">
          <section
            class="body desktop-only"
            :style="{
              backgroundImage:
                'url(' + card.fields.featuredImage.fields.file.url + ')'
            }"
          >
            <div class="content">
              <header class="text--primary text--uppercase">
                {{ card.fields.title }}
              </header>
              <section>
                {{ card.fields.body }}
              </section>
            </div>
          </section>
          <nuxt-img
            :src="sanitizeImageUrl(card.fields.featuredImage.fields.file.url)"
            alt=""
            class="mobile-only"
          />
        </nuxt-link>
        <footer>
          <nuxt-link
            :to="'/collections/' + card.fields.collectionHandle"
            class="flex flex--items-baseline"
          >
            <h3 class="collection-title mb-0">{{ card.fields.title }}</h3>
            <span class="starting-at flex flex--items-center">
              Starting at $8 &nbsp;
              <arrow-right />
            </span>
          </nuxt-link>
        </footer>
      </div>
    </section>
  </div>
</template>

<script>
import ArrowRight from '@/components/lola/icons/ArrowRight'
import commonMixins from '~/mixins/commonMixins'
export default {
  components: {
    ArrowRight
  },
  mixins: [commonMixins],
  props: {
    title: {
      type: String,
      default: ''
    },
    cards: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.categories {
  margin: 80px 0;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  a {
    text-decoration: none;
    color: inherit;
  }

  .pane {
    .body {
      display: flex;
      height: 34vw;
      padding: 20px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;

      .content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        width: 100%;
        margin: 0;
        padding: 40px 0;
        background-color: rgba(248, 246, 242, 0.95);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

        &:hover {
          opacity: 1;
        }

        header {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 24px;
        }

        section {
          max-width: 210px;
        }
      }
    }

    img {
      width: 100%;
    }

    footer {
      padding: 12px 15px 12px 0;

      a {
        text-decoration: none;
      }
    }

    .collection-title {
      margin-right: 24px;
    }

    .starting-at {
      font-size: 14px;

      svg {
        stroke: #514945;
      }

      &:hover {
        svg {
          stroke: #4e6282;
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .categories {
    display: block;
    margin-top: 60px;
    padding: 0 16px;

    .pane {
      .body {
        height: auto;
      }

      footer {
        justify-content: space-between;
        margin-bottom: 36px;
      }
    }
  }
}
</style>
