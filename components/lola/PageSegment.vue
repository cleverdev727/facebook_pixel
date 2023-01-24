<template>
  <section class="container mx-auto">
    <header class="flex justify--between flex--items-center">
      <h3 v-if="title" class="text--blue fw-md">{{ title }}</h3>
      <divider />
      <a v-if="ctaText && ctaUrl" class="button" :href="ctaUrl">{{
        ctaText
      }}</a>
    </header>
    <page-content class="page" :page="page" />
  </section>
</template>

<script>
import Divider from './Divider.vue'

export default {
  components: { Divider },
  props: {
    content: {
      type: [Array, Object],
      default: null
    },
    ctaText: {
      type: String,
      default: ''
    },
    ctaUrl: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    page() {
      const page = { sections: [] }
      if (!this.content) return page
      const contents = Array.isArray(this.content)
        ? this.content
        : [this.content]
      contents.forEach((content) => {
        page.sections.push(content)
      })

      return page
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 70px;
  margin-bottom: 70px;
}

header {
  column-gap: 36px;
  margin-bottom: 32px;
}

.button {
  min-width: 150px;
}

@media screen and (max-width: $medium-screen) {
  header {
    column-gap: 16px;
  }
}
</style>
