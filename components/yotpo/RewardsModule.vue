<template>
  <div class="yotpo-rewards-module">
    <div
      v-if="isSandbox"
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8484"
    ></div>
    <div
      v-else
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8819"
    ></div>
  </div>
</template>

<script>
import yotpo from '@/mixins/yotpo'
export default {
  mixins: [yotpo],
  watch: {
    $route: {
      handler() {
        this.savePoints()
      }
    }
  },
  mounted() {
    this.loadYotpoScript()
  }
}
</script>
