export default {
  title: 'Components | Cart'
}
export const FlyoutHeader = () => ({
  data() {
    return {}
  },
  template: '<cart-flyout-header/>'
})

FlyoutHeader.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}

export const RemoveButton = () => ({
  data() {
    return {
      id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yODU2ODgyMDAyMzQwMQ==::106d9dd5-44ec-4b0b-b558-0c42657bf812'
    }
  },
  template: '<cart-flyout-item-remove-button :lineId="id"/>'
})

RemoveButton.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}

export const FlyoutSubtotal = () => ({
  template: '<cart-flyout-subtotal/>',
  mounted() {
    this.$store.commit('cart/setLineItems', [])
    this.$store.dispatch('cart/addLineItem', {
      image: {
        source: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
      },
      title: 'Gray T-Shirt',
      productId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4NjE3Mzc=',
      handle: 'gray-t-shirt',
      quantity: 1,
      variant: {
        id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yODU2ODgyMDAyMzQwMQ==',
        price: '29.99'
      }
    })

    this.$store.dispatch('cart/addLineItem', {
      image: {
        source: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
      },
      title: 'Black T-Shirt',
      productId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4djE3Mzc=',
      handle: 'black-t-shirt',
      quantity: 1,
      variant: {
        id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWaudC8yODU2ODgyMDAyMzQwMQ==',
        price: '29.99'
      }
    })
    this.$store.dispatch('cart/addLineItem', {
      image: {
        source: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
      },
      title: 'Brown T-Shirt',
      productId: 'Z2lkOi8vc2hvcGlmeS9QcmzkdWN0LzM1OTkyMDE4djE3Mzc=',
      handle: 'brown-t-shirt',
      quantity: 1,
      variant: {
        id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWaudC8yODU3ODgyMDAyMzQwMQ==',
        price: '29.99'
      }
    })
  }
})

FlyoutSubtotal.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}

export const FlyoutCheckoutButton = () => ({
  data() {
    return {}
  },
  template: '<cart-flyout-checkout-button/>'
})

FlyoutCheckoutButton.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}
