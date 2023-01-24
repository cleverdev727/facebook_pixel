<template>
  <section>
    <div class="account">
      <account-header />
      <section class="account__content">
        <div class="my-rewards">
          <rewards-module />
          <campaigns-module />
          <referrer-module />
        </div>
      </section>
    </div>
  </section>
</template>
<script>
import ReferrerModule from '@/components/yotpo/ReferrerModule.vue'
import RewardsModule from '@/components/yotpo/RewardsModule.vue'
import CampaignsModule from '@/components/yotpo/CampaignsModule.vue'

export default {
  components: { CampaignsModule, ReferrerModule, RewardsModule },
  middleware: 'authenticated'
}
</script>

<style lang="scss" scoped>
::v-deep {
  .yotpo-referral-module {
    margin-top: 40px;
  }
}
</style>
