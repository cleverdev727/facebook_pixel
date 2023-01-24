import { mount, shallowMount } from '@vue/test-utils'

class Builder {
  constructor(Component, defaultOptions, shallow = false) {
    this.defaultOptions = defaultOptions
    this.options = {}
    this.shallow = shallow
    this.Component = Component
  }

  setOptions(options) {
    this.options = { ...this.options, ...options }
    return this
  }

  build() {
    let defaultData = {}

    const { data, ...rest } = this.options

    if (data) {
      defaultData = { ...defaultData, ...data }
    }

    this.defaultOptions.data = function () {
      return defaultData
    }

    const mountFn = this.shallow ? shallowMount : mount
    const wrapper = mountFn(this.Component, { ...this.defaultOptions, ...rest })

    return wrapper
  }
}

export const TestWrapperBuilder = (...options) => new Builder(...options)
