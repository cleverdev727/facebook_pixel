<template>
  <div class="yotpo-referral-module">
    <div
      v-if="isSandbox"
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8524"
    ></div>
    <div
      v-else
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8815"
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
