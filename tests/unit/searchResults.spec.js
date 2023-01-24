import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import SearchResults from '@/components/nacelle/SearchResults'
import storeConfig from '@/tests/storeConfig'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('SearchResults.vue', () => {
  const store = new Vuex.Store(storeConfig())
  const wrapper = mount(SearchResults, {
    localVue,
    store
  })

  wrapper.vm.searchCatalog = jest.fn()

  it('hides autocomplete and requests fresh search results when search query changes', async () => {
    wrapper.setProps({ searchQuery: 'test' })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.searchCatalog).toHaveBeenCalledWith({
      value: 'test',
      position: 'global'
    })
  })

  it('updates internal state when global results are updated', async () => {
    store.commit('search/setResults', {
      position: 'global',
      results: ['compact app']
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalState).toBe('results')

    store.commit('search/setResults', {
      position: 'global',
      results: []
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.internalState).toBe('no-results')
  })

  it('updates internal state when "isLoading" is updated', async () => {
    store.commit('search/setLoading', true)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.internalState).toBe('loading')
  })

  it('does nothing when value of search query is empty', async () => {
    wrapper.vm.searchCatalog.mockClear()
    wrapper.setProps({ searchQuery: '' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.searchCatalog).not.toHaveBeenCalled()
  })
})
