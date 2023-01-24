import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import YotpoActivity from '@/components/yotpo/ActivityModule'
import YotpoCampaigns from '@/components/yotpo/CampaignsModule'
import ReferFriend from '@/components/yotpo/ReferFriendStaticModule'
import ReferModule from '@/components/yotpo/ReferrerModule'
import RewardsModule from '@/components/yotpo/RewardsModule'
import CustomerPoints from '@/components/account/CustomerPoints'
import storeConfig from '@/tests/storeConfig'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store(storeConfig)
const localComputed = {
  isSandbox() {
    return true
  }
}
const ActivityWrapper = shallowMount(YotpoActivity, {
  localVue,
  store,
  computed: localComputed
})

const CampaignWrapper = shallowMount(YotpoCampaigns, {
  localVue,
  store,
  computed: localComputed
})

const ReferFriendWrapper = shallowMount(ReferFriend, {
  localVue,
  store,
  computed: localComputed
})

const ReferWrapper = shallowMount(ReferModule, {
  localVue,
  store,
  computed: localComputed
})

const RewardsWrapper = shallowMount(RewardsModule, {
  localVue,
  store,
  computed: localComputed
})

const PointsWrapper = shallowMount(CustomerPoints, {
  localVue,
  store,
  computed: localComputed,
  data() {
    return {
      customer: { yotpoPoints: 200 }
    }
  },
  stubs: ['nuxt-link']
})

describe('Yotpo modules', () => {
  it('renders yotpo modules', () => {
    expect(
      ActivityWrapper.find('.yotpo-my-activity-module').exists()
    ).toBeTruthy()
    expect(
      CampaignWrapper.find('.yotpo-campaigns-module').exists()
    ).toBeTruthy()
    expect(
      ReferFriendWrapper.find('.yotpo-refer-friend-static-module').exists()
    ).toBeTruthy()
    expect(ReferWrapper.find('.yotpo-referral-module').exists()).toBeTruthy()
    expect(RewardsWrapper.find('.yotpo-rewards-module').exists()).toBeTruthy()
    expect(PointsWrapper.find('span').text()).toEqual('Your Insider Points')
    expect(PointsWrapper.find('.yotpo-rewards-module').exists()).toBeTruthy()
  })
})
