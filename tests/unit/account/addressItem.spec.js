import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import storeConfig from '@/tests/storeConfig'
import addressItemComponent from '@/components/account/AddressItem'
import subscriptions from '@/tests/mocks/subscriptions'
import products from '@/tests/mocks/products'
import addresses from '@/tests/mocks/addresses'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
const store = new Vuex.Store(storeConfig)
const toggleAddressPreviewSpy = jest.spyOn(
  addressItemComponent.methods,
  'toggleAddressPreview'
)
const showSubscriptionDetailsSpy = jest.spyOn(
  addressItemComponent.methods,
  'showSubscriptionDetails'
)
const cancelSubscriptionSpy = jest.spyOn(
  addressItemComponent.methods,
  'cancelSubscription'
)
const activateSubSpy = jest.spyOn(addressItemComponent.methods, 'activateSub')
const pauseSubSpy = jest.spyOn(addressItemComponent.methods, 'pauseSub')
const wrapper = shallowMount(addressItemComponent, {
  localVue,
  router,
  store,
  propsData: {
    address: addresses[0],
    index: 0,
    subscriptions,
    products
  },
  stubs: ['client-only', 'nuxt-link', 'nuxt-img', 'calendar', 'skip-to-donate']
})

describe('AdressItem.vue', () => {
  it('renders correctly', () => {
    expect(wrapper.vm.$data.showCancelModal).toEqual(false)
    expect(wrapper.find('.subscription-card__last-updated').text()).toEqual(
      'Last edited: 1/25/2022'
    )
  })

  it('shows product card preview on click', () => {
    const hideAddressPreviewCta = wrapper.find('.subscription-card__title')
    expect(hideAddressPreviewCta.text()).toEqual('Subscription 1')
    hideAddressPreviewCta.trigger('click')
    expect(wrapper.vm.$data.showAddressPreview).toEqual(false)
    hideAddressPreviewCta.trigger('click')
    expect(wrapper.vm.$data.showAddressPreview).toEqual(true)
    expect(toggleAddressPreviewSpy).toHaveBeenCalled()
  })

  it('shows subscription card details on click', () => {
    const previewCta = wrapper.find('.subscription-item__preview')
    expect(previewCta.text()).toContain('Pads with wings: 6 Month')
    previewCta.trigger('click')
    expect(showSubscriptionDetailsSpy).toHaveBeenCalled()
  })

  it('show and hides pause modal', () => {
    expect(wrapper.vm.$data.showPauseModal).toEqual(false)
    const pauseCta = wrapper.findAll('.renewal-date-picker__change').at(1)
    expect(pauseCta.text()).toEqual('Cancel or Pause')
    pauseCta.trigger('click')
    expect(wrapper.vm.$data.showPauseModal).toEqual(true)
    wrapper.find('.close').trigger('click')
    expect(wrapper.vm.$data.showPauseModal).toEqual(false)
  })

  it('cancels subscription', async () => {
    const cancelDiv = wrapper.findAll('.modal__recharge-subscription').at(1)
    const cancelCta = cancelDiv.find('button')
    const cancelOptions = cancelDiv.findAll('option')
    const optionTwo = cancelOptions.at(1).text()
    expect(cancelCta.text()).toEqual('Cancel subscription')
    await cancelOptions.at(1).setSelected()
    expect(wrapper.vm.$data.cancelReason).toEqual(optionTwo)
    cancelCta.trigger('click')
    expect(cancelSubscriptionSpy).toHaveBeenCalled()
  })

  it('pauses subscripiton', () => {
    const pauseDiv = wrapper.find('.modal__recharge-subscription')
    const pauseCta = pauseDiv.find('button')
    const pauseForm = pauseDiv.find('form')
    const pauseOneMonth = pauseDiv.find('label')
    expect(pauseCta.text()).toEqual('Pause Subscription')
    expect(pauseOneMonth.text()).toEqual('1 month')
    pauseForm.trigger('submit')
    expect(pauseSubSpy).toHaveBeenCalled()
  })

  it('reactivates subscription', () => {
    const reactivateCta = wrapper.find('.subscription-item__reactivate')
    expect(reactivateCta.text()).toEqual('Re-activate')
    reactivateCta.trigger('click')
    expect(activateSubSpy).toHaveBeenCalled()
  })
})
