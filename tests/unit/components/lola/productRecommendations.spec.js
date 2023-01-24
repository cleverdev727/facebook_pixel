import { mount } from '@vue/test-utils'
import ProductCard from '@/components/lola/ProductCard'
import ProductRecommendations from '@/components/lola/ProductRecommendations.vue'
import allProducts from '../../../mocks/products'

const wrapper = mount(ProductRecommendations, {
  propsData: {
    products: allProducts.slice(0, 3)
  },
  stubs: ['product-card']
})
const container = wrapper.find('.product-recommendations')

describe('ProductRecommendations.vue', () => {
  it('renders a parent container that displays product cards', () => {
    expect(container.exists()).toBe(true)
    expect(container.element.tagName.toLowerCase()).toBe('ul')
  })

  it('renders product cards', () => {
    const cards = wrapper.findAllComponents(ProductCard)
    expect(cards.length).toBe(3)
  })

  it('renders nothing when products prop is empty or undefined', async () => {
    await wrapper.setProps({ products: undefined })
    const cards = wrapper.findAllComponents(ProductCard)
    expect(cards.length).toBe(0)
  })
})
