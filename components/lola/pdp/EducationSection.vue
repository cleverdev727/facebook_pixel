<template>
  <section class="education">
    <div class="education__wrapper">
      <div v-if="innovation.video" class="education__wrapper-video">
        <iframe
          class="eduframe"
          :src="innovation.video"
          allowfullscreen="allowfullscreen"
          mozallowfullscreen="mozallowfullscreen"
          msallowfullscreen="msallowfullscreen"
          oallowfullscreen="oallowfullscreen"
          webkitallowfullscreen="webkitallowfullscreen"
          frameborder="0"
        >
        </iframe>
      </div>
      <div v-else class="education__wrapper-image">
        <nuxt-img
          :data-lazy="innovation.image"
          :src="innovation.image"
          :alt="innovation.title + ' image'"
          class="fade"
        />
      </div>
      <div class="education__wrapper-content">
        <h3>{{ innovation.title }}</h3>
        <div v-html="innovation.content"></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    innovation() {
      const { metadata } = this.product
      return Object.keys(metadata).reduce((acc, key) => {
        if (key.startsWith('innovation')) {
          acc[key.toLowerCase().replace('innovation', '')] = metadata[key]
        }

        return acc
      }, {})
    }
  }
}
</script>
