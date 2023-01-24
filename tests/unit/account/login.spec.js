import { mount, createLocalVue } from '@vue/test-utils'
import LoginForm from '@/components/account/LoginForm'
import storeConfig from '@/tests/storeConfig'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('LoginForm.vue', () => {
  const store = new Vuex.Store(storeConfig())

  it('Login form renders', () => {
    const wrapper = mount(LoginForm, {
      localVue,
      store,
      stubs: ['nuxt-link', 'client-only'],
      data() {
        return {
          showLogin: true
        }
      }
    })
    expect(wrapper.text()).toContain('Welcome back!')
  })
})
