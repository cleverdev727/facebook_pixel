<template>
  <client-only>
    <div class="yotpo-rewards-module reward-module">
      <span class="reward-module_header">Your Insider Points</span>
      <span class="reward-module_desc">
        Earn points every time you shop and redeem for savings on your next
        order.
      </span>
      <div class="reward-module_row">
        <span v-if="customer.yotpoPoints" class="reward-module_points">{{
          customer.yotpoPoints
        }}</span>
        <rewards-module v-else />
        <a class="reward-module_link" href="/account/my-rewards">
          Redeem <span class="reward-module_icon">&#10230;</span>
        </a>
      </div>
    </div>
  </client-only>
</template>

<script>
import RewardsModule from '@/components/yotpo/RewardsModule.vue'
import yotpo from '@/mixins/yotpo'

export default {
  components: { RewardsModule },
  mixins: [yotpo]
}
</script>

<style lang="scss" scoped>
.reward-module {
  background-color: #4e6282;
  color: #fff;
  margin-top: 1em;
  padding: 1em;
  font-size: 16px;
  border-radius: 0.5em;

  &_header {
    display: block;
    padding-bottom: 0.5em;
    font-size: 16px;
  }

  &_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0.5em;
    min-height: 4em;
  }

  &_points {
    font-size: 38px;
    font-weight: 400;
  }

  &_link {
    color: #fff;
    font-size: 16px;
    text-decoration: none;
    margin-right: 2em;
    padding-top: 1em;
  }

  &_icon {
    display: inline-block;
    transform: scale(2.5);
    margin-left: 1em;
    padding-bottom: 0.5em;
  }
}
</style>
