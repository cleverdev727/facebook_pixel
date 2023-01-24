import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import SearchInput from '@/components/nacelle/SearchInput'
import storeConfig from '@/tests/storeConfig'
// import search from '../../store/search'

jest.useFakeTimers()

const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(Vuex)
localVue.use(VueRouter)

const trackSearchEventSpy = jest.spyOn(SearchInput.methods, 'trackSearchEvent')

describe('SearchInput.vue', () => {
  const store = new Vuex.Store(storeConfig())
  let wrapper = mount(SearchInput, {
    store,
    localVue,
    attachTo: document.body
  })

  it('renders a search input', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('tracks search event on input', async () => {
    // create search result element
    const searchResult = document.createElement('input')
    document.childNodes[document.childNodes.length - 1].appendChild(
      searchResult
    )
    const wrapper = mount(SearchInput, {
      store,
      localVue,
      attachTo: document.body,
      data() {
        return {
          loclQuery: ''
        }
      }
    })

    searchResult.classList.add('autocomplete')
    wrapper.vm.searchProducts = jest.fn()

    // Simulate typing and triggering the keyup event
    wrapper.find('input').setValue('a')
    wrapper.trigger('keyup', { key: 'a' })

    jest.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.searchProducts).toHaveBeenCalledWith({ query: 'a' })
    expect(trackSearchEventSpy).toHaveBeenCalled()
    expect(searchResult).toBeVisible()

    // Assert that search result element gets hidden
    // when local query value is en empty string
    wrapper.setData({ localQuery: '' })
    wrapper.trigger('keyup', { key: 'a' })
    await wrapper.vm.$nextTick()

    expect(searchResult).not.toBeVisible()

    // Assert that nothing changes when search
    // result element doesn't exist in the DOM
    searchResult.remove()

    wrapper.setData({ localQuery: '' })
    wrapper.trigger('keyup', { key: 'a' })
    await wrapper.vm.$nextTick()

    expect(searchResult).not.toBeVisible()
  })

  wrapper = mount(SearchInput, {
    store,
    localVue,
    router,
    propsData: {
      position: 'local'
    },
    attachTo: document.body,
    data() {
      return {
        localQuery: null
      }
    }
  })

  it('gives focus to search input', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.element).toHaveFocus()
  })

  it('sets localQuery value to null when search query is null', async () => {
    wrapper.setProps({ searchQuery: null })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.localQuery).toBeNull()
  })

  it('sets localQuery value when search query is not null', async () => {
    wrapper.setProps({ searchQuery: 'test', position: 'local' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.localQuery).toBe('test')
  })

  it('blurs global search input when route changes', async () => {
    wrapper.setProps({ searchQuery: null, position: 'global' })
    await wrapper.vm.$nextTick()
    wrapper.vm.$router.push({ path: '/another/route' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.localQuery).toBe(null)
    expect(wrapper.element).not.toHaveFocus()
  })

  it('emits update when localQuery changes', async () => {
    wrapper.setData({ localQuery: 'test' })
    await wrapper.vm.$nextTick()
    jest.runAllTimers()
    expect(wrapper.emitted().update).toBeTruthy()
    expect(wrapper.emitted().update[0]).toEqual(['test'])
  })
})
