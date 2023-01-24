import { shallowMount } from '@vue/test-utils'
import SearchNoResults from '@/components/nacelle/SearchNoResults.vue'

const wrapper = shallowMount(SearchNoResults)

describe('SearchNoResult.vue', () => {
  it('renders a div that shows a message when the search result is empty', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('shows default title and subtitle texts', () => {
    const title = wrapper.find('h2')
    const subtitle = wrapper.find('p')
    expect(title.text()).toBe(wrapper.vm.title)
    expect(subtitle.text()).toBe(wrapper.vm.subtitle)
    expect(title.text()).toBe('Oops...no results!')
    expect(subtitle.text()).toBe(
      'Try adjusting the filters or try another search...'
    )
  })
})
