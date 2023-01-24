<template>
  <chevron-circle-right />
</template>

<script>
import ChevronCircleRight from './ChevronCircleRight.vue'

export default {
  components: { ChevronCircleRight }
}
</script>

<style lang="scss" scoped>
/*! purgecss start ignore */
::v-deep svg {
  transform: rotate(180deg);
}
/*! purgecss end ignore */
</style>
