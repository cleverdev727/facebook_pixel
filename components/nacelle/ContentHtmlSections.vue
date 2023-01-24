<template>
  <section>
    <div v-html="htmlContent"></div>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    html: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    htmlContent() {
      return this.html.map((section) => section.fields.htmlContent).join('\n')
    }
  }
}
</script>
