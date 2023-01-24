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
    htmlContent: {
      type: String,
      default: () => {
        return ''
      }
    }
  }
}
</script>
