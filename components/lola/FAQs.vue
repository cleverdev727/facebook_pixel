<template>
  <div class="faqs">
    <section class="content mx-auto">
      <h2 class="text--center header">Frequently asked questions</h2>
      <div v-for="(faq, index) in faqs" :key="index" class="topic">
        <h3>{{ faq.fields.title }}</h3>
        <article v-html="html(faq.fields.body)"></article>
      </div>
      <div class="cta">
        <nuxt-link :to="ctaUrl" class="button button--stripped">{{
          ctaText
        }}</nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

export default {
  props: {
    ctaText: {
      type: String,
      default: 'Go'
    },
    ctaUrl: {
      type: String,
      default: '#'
    },
    faqs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    html(content) {
      return documentToHtmlString(content)
    }
  }
}
</script>

<style lang="scss" scoped>
.faqs {
  margin-top: 60px;
  padding-top: 50px;
  padding-bottom: 50px;

  > section {
    width: 100%;
    max-width: 850px;
  }

  .topic {
    border-top: 1px solid #dddddd;
    padding: 60px 0;

    &:last-of-type {
      padding-bottom: 40px;
    }
  }
}

.cta {
  width: 255px;
  max-width: 100%;
  margin: 0 auto;
}

@media screen and (max-width: $medium-screen) {
  .faqs {
    padding: 20px 20px 60px;
    .topic {
      padding: 30px 0px;
    }
  }
}
</style>
