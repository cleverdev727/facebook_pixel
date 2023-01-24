import UpsellProductForm from '@/components/lola/UpsellProductForm.vue'
import { shallowMount } from '@vue/test-utils'
import { defaultProduct } from './../mocks/defaultObjects'

const product = {
  ...defaultProduct,
  body: '<h3>This is a sample body content for an upsell product</h3>',
  metadata: {
    ctaUrl: '/products/lola-memberships',
    ctaText: 'Learn more',
    name: 'LOLA membership (upsell)',
    productHandle: 'lola-memberships::en-us',
    handle: 'lola-memberships',
    isSubscriptionOnly: false,
    title: 'LOLA+ Membership',
    priceRange: { min: '20.0', max: '20.0', currencyCode: 'USD' },
    shippingIntervalFrequency: [4, 8],
    subscriptionId: 119666,
    variants: [
      {
        id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNzkzMzMwMTYyOTEyMQ==',
        title: 'Default Title',
        price: '20.0'
      }
    ],
    variantToDuplicate: {}
  }
}

const productBodySpy = jest.fn().mockReturnValue(product.body)

describe('upsellProductForm.vue', () => {
  const wrapper = shallowMount(UpsellProductForm, {
    propsData: {
      formProduct: product
    },
    data() {
      return {
        addForm: false,
        documentToHtmlString: productBodySpy
      }
    }
  })

  it('renders an upsell product container', () => {
    expect(wrapper.exists()).toBe(true)
    expect(productBodySpy).toHaveBeenCalledWith(product.body)
    expect(wrapper.find('.description').text().trim()).toBe(
      'This is a sample body content for an upsell product'
    )
  })

  it('renders product form', async () => {
    wrapper.setData({ addForm: true })
    await wrapper.vm.$nextTick()
    const form = wrapper.find('form.upsell-product-form')
    expect(form.exists()).toBe(true)
  })

  it('sets "onetime" value for one-time products', () => {
    const purchaseTypeField = wrapper.find('input[name=purchase_type]')
    expect(purchaseTypeField.exists()).toBe(true)
    expect(purchaseTypeField.element).toHaveValue('onetime')
  })

  it('adds subscription properties for subscription products', async () => {
    const updatedMetadata = { ...product.metadata, isSubscriptionOnly: true }
    const newProduct = { ...product, metadata: updatedMetadata }
    wrapper.setProps({ formProduct: newProduct })
    await wrapper.vm.$nextTick()
    const form = wrapper.find('form.upsell-product-form')
    const subscriptionIdField = form.element.querySelector(
      'input[name="properties[subscription_id]"]'
    )
    const purchaseTypeField = form.find('input[name=purchase_type]')
    expect(purchaseTypeField.exists()).toBe(true)
    expect(subscriptionIdField.value).toEqual(
      product.metadata.subscriptionId?.toString()
    )
  })

  it('sets correct shipping interval frequency value', async () => {
    const form = wrapper.find('form.upsell-product-form')
    const shippingFrequencyField = form.element.querySelector(
      'input[name="properties[shipping_interval_frequency]"]'
    )
    expect(shippingFrequencyField.value).toEqual(
      product.metadata.shippingIntervalFrequency[0].toString()
    )
    const updatedMetadata = {
      ...product.metadata,
      shippingIntervalFrequency: 4,
      isSubscriptionOnly: true
    }
    const newProduct = { ...product, metadata: updatedMetadata }
    wrapper.setProps({ formProduct: newProduct })
    await wrapper.vm.$nextTick()
    expect(shippingFrequencyField.value).toEqual(
      newProduct.metadata.shippingIntervalFrequency.toString()
    )
  })
})
