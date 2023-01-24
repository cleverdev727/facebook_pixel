<template>
  <div class="yotpo-refer-friend-static-module">
    <div
      v-if="isSandbox"
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8813"
    ></div>
    <div
      v-else
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8818"
    ></div>
    <slot></slot>
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
