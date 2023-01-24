import { createLocalVue, shallowMount } from '@vue/test-utils'

import RadioIcon from '@/components/lola/icons/RadioIcon.vue'

const localVue = createLocalVue()

const wrapper = shallowMount(RadioIcon, {
  localVue,
  propsData: {
    checked: true,
    height: '64',
    width: '64'
  }
})

const wrapper2 = shallowMount(RadioIcon, {
  localVue,
  propsData: {
    checked: false
  }
})

describe('RadioIcon.vue', () => {
  it('displays the icon', () => {
    expect(wrapper.find('div').element.style.width).toEqual('64px')
    expect(wrapper.find('div').element.style.height).toEqual('64px')
    expect(wrapper.find('.no-border').exists()).toBeTruthy()

    expect(wrapper2.find('div').element.style.width).toEqual('32px')
    expect(wrapper2.find('div').element.style.height).toEqual('32px')
    expect(wrapper2.find('.no-border').exists()).toBeFalsy()
  })
})
