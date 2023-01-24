<template>
  <div class="yotpo-my-activity-module">
    <div
      v-if="isSandbox"
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8645"
    ></div>
    <div
      v-else
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8816"
    ></div>
  </div>
</template>

<script>
import yotpo from '@/mixins/yotpo'
export default {
  mixins: [yotpo],
  mounted() {
    this.loadYotpoScript()
  }
}
</script>
