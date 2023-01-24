import Vuex from 'vuex'
import { createLocalVue, mount } from '@vue/test-utils'
import AccountNotification from '@/components/account/AccountNotification.vue'
import Notification from '@/components/lola/Notification.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('AccountNotification.vue', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each([
    ['error', 'An error message', 'Oops! Something went wrong.'],
    ['success', 'A success message', 'Success']
  ])('renders AccountNotification for type: %s', (type, message, h4Message) => {
    const store = new Vuex.Store({
      modules: {
        account: {
          state: {
            accountNotification: {
              type,
              message
            }
          },
          namespaced: true
        }
      }
    })
    const wrapper = mount(AccountNotification, {
      localVue,
      store,
      stubs: ['client-only']
    })
    expect(wrapper.vm.accountNotification).toEqual({
      message,
      type
    })
    expect(wrapper.find('h4').text()).toEqual(h4Message)
    expect(wrapper.find('small').text()).toEqual(message)
  })

  it.each([['error'], ['success']])(
    'calls showNotification when accountNotification state changes - %s',
    (type) => {
      const store = new Vuex.Store({
        modules: {
          account: {
            state: {
              accountNotification: {
                type: 'type',
                message: 'message'
              }
            },
            namespaced: true
          }
        }
      })
      const spy = jest.spyOn(Notification.methods, 'showNotification')
      const wrapper = mount(AccountNotification, {
        localVue,
        store,
        stubs: ['client-only']
      })
      store.state.account.accountNotification = {
        type,
        message: 'message'
      }
      wrapper.vm.$nextTick(() => {
        expect(spy).toBeCalled()
      })
    }
  )
})
