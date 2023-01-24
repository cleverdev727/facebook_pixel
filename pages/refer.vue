<template>
  <div class="rewards-refer">
    <referrer-module />
  </div>
</template>

<script>
import ReferrerModule from '@/components/yotpo/ReferrerModule.vue'

export default {
  components: { ReferrerModule }
}
</script>

<style lang="scss" scoped>
.rewards-refer {
  min-height: 100vh;
}
</style>
