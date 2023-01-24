<template>
  <section class="rewards-landing">
    <div id="rewards-page">
      <section class="jumbotron flex">
        <div
          class="content mx-auto flex flex--items-center justify--center flex--column"
        >
          <h1
            class="header-text text--white mb-0"
            data-live-text-setting="section.rewards-hero-section.header-text"
          >
            LOLA Rewards
          </h1>
          <div
            class="text--white text--center"
            data-live-text-setting="section.rewards-hero-section.body-text"
          >
            <p>
              Get exclusive perks with our rewards program, every time you shop
              with us.
            </p>
          </div>
          <div class="buttons mx-auto flex flex--space-between full-width">
            <nuxt-link to="/account/login" class="button button--stripped-white"
              >Sign in</nuxt-link
            >
            <nuxt to="/account/register" class="button button--stripped-white"
              >Sign up</nuxt
            >
          </div>
        </div>
      </section>
    </div>
    <activity-module />
    <campaigns-module />
    <referrer-module />
    <refer-friend-static-module />
  </section>
</template>

<script>
import ActivityModule from '@/components/yotpo/ActivityModule.vue'
import CampaignsModule from '@/components/yotpo/CampaignsModule.vue'
import ReferrerModule from '@/components/yotpo/ReferrerModule.vue'
import ReferFriendStaticModule from '@/components/yotpo/ReferFriendStaticModule.vue'
export default {
  components: {
    ActivityModule,
    CampaignsModule,
    ReferrerModule,
    ReferFriendStaticModule
  }
}
</script>
