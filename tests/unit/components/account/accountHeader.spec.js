import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { createLocalVue, mount } from '@vue/test-utils'
import AccountHeader from '@/components/account/AccountHeader.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()

const actions = {
  logout: jest.fn()
}

const store = new Vuex.Store({
  modules: {
    account: {
      actions,
      namespaced: true
    }
  }
})

const wrapper = mount(AccountHeader, {
  localVue,
  router,
  store,
  stubs: ['nuxt-link']
})

describe('AccountHeader.vue', () => {
  it('renders AccountHeader', () => {
    const linkList = wrapper.findAll('.account-header__list-item')
    expect(wrapper.find('h1').text()).toEqual('My account')
    expect(wrapper.find('ul').exists()).toBe(true)
    expect(linkList.length).toBe(5)
  })

  it('customer is able to logout', async () => {
    const linkList = wrapper.findAll('.account-header__list-item')
    const lastIndex = linkList.length - 1
    const logoutItem = linkList.at(lastIndex)

    const windowSpy = jest.spyOn(global, 'window', 'get')
    windowSpy.mockImplementation(() => ({
      dataLayer: {
        filter: jest.fn()
      }
    }))
    await logoutItem.find('nuxt-link-stub').trigger('click')
    expect(actions.logout).toHaveBeenCalled()
    windowSpy.mockRestore()
  })
})
