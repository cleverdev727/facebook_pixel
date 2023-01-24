import Vue from 'vue'
import Vuex from 'vuex'
import GlobalHeader from '@/components/lola/GlobalHeader.vue'
import storeConfig from '@/tests/storeConfig'
import linkedLists from '../../../mocks/linked-lists'
import { TestWrapperBuilder } from '../../../../utils/tests.util'
import { blogCategories } from './../../../mocks/blogs'
import { getBlogCategories } from '~/helpers/blog'

Vue.use(Vuex)
jest.useFakeTimers()

jest.mock('~/helpers/blog', () => {
  return {
    _esModule: true,
    ...jest.requireActual('~/helpers/blog'),
    getBlogCategories: jest.fn()
  }
})

getBlogCategories.mockResolvedValue({ items: blogCategories })

// Setup spies
const bodyPaddingSpy = jest.spyOn(GlobalHeader.methods, 'setBodyTopPadding')
const handleMobileClickSpy = jest.spyOn(
  GlobalHeader.methods,
  'handleMobileClick'
)
const hideSubMenuSpy = jest.spyOn(GlobalHeader.methods, 'hideSubMenu')
const hideSearchbarSpy = jest.spyOn(GlobalHeader.methods, 'hideSearchbar')
const hideSidebarSpy = jest.spyOn(GlobalHeader.methods, 'hideSidebar')
const showSidebarSpy = jest.spyOn(GlobalHeader.methods, 'showSidebar')
const unstickMenuSpy = jest.spyOn(GlobalHeader.methods, 'unstickNavMenu')
const toggleSearchInputSpy = jest.spyOn(
  GlobalHeader.methods,
  'toggleSearchInput'
)
const setRecommendedProductsMockFn = jest.fn()
const _storeConfig = storeConfig()
const mockStoreConfig = {
  modules: {
    ..._storeConfig.modules,
    'product/recommendations': {
      namespaced: true,
      actions: {
        setRecommendedProducts: setRecommendedProductsMockFn
      }
    }
  }
}

const $router = { push: jest.fn() }
const $route = { path: '/does/not/exist' }
const store = new Vuex.Store(mockStoreConfig)
store.commit('space/setLinklists', linkedLists)

const wrapperBuilder = TestWrapperBuilder(GlobalHeader, {
  attachTo: document.body,
  mocks: { $router, $route },
  store,
  stubs: [
    'nuxt-link',
    'nuxt-img',
    'main-nav-cart',
    'cart',
    'client-only',
    'search-autocomplete',
    'search-box'
  ]
})

describe('GlobalHeader.vue', () => {
  const wrapper = wrapperBuilder.build()

  it('renders a global site header', () => {
    expect(wrapper.exists()).toBe(true)
    expect(bodyPaddingSpy).toHaveBeenCalled()
  })

  it('renders primary menus', () => {
    const primaryNav = wrapper.find('.primary-nav')
    expect(primaryNav.exists()).toBe(true)
    const primaryNavMenuItems = primaryNav.findAll('.nav-list > li')
    expect(primaryNavMenuItems.length).toBeGreaterThan(0)
  })

  it('renders secondary menus', () => {
    const secondaryNav = wrapper.find('.secondary-nav')
    expect(secondaryNav.exists()).toBe(true)
    const secondaryNavMenuItems = secondaryNav.findAll('.nav-list > li')
    expect(secondaryNavMenuItems.length).toBeGreaterThan(0)
  })

  it('assigns `new` menu links', () => {
    const sampleMenus = [{ title: 'Applicator tampon' }, { title: 'Pads!' }]
    const processedMenu = wrapper.vm.processMenuList(sampleMenus)

    expect(processedMenu[0].isNew).toBe(false)
    expect(processedMenu[1].isNew).toBe(true)
    expect(processedMenu[1].title).toBe('Pads')
  })

  describe('tests submenu visibility toggle on mobile', () => {
    it('reveals submenus', async () => {
      const categoryTitle = wrapper.find(
        '.app-nav .nav-list > li > a.category-title'
      )
      const html = wrapper.element.parentElement.parentElement
      const navIsOpen = html.classList.contains('nav-open')
      categoryTitle.trigger('click')
      await wrapper.vm.$nextTick()
      expect(handleMobileClickSpy).toHaveBeenCalled()
      expect(handleMobileClickSpy).toHaveReturnedWith(!navIsOpen)
      expect(unstickMenuSpy).toHaveBeenCalled()
      expect($router.push).toHaveBeenCalled()
    })

    it('hides submenus', async () => {
      const submenuItem = wrapper.find('.app-nav .nav-list > li .back-btn')
      submenuItem.trigger('click')
      await wrapper.vm.$nextTick()
      expect(hideSubMenuSpy).toHaveBeenCalled()
    })
  })

  describe('tests search bar visibility toggle', () => {
    it('reveals search bar', async () => {
      expect(wrapper.vm.searchInputVisible).toBe(false)
      const searchIcon = wrapper.find('.search-icon')
      searchIcon.trigger('click')
      await wrapper.vm.$nextTick()
      expect(toggleSearchInputSpy).toHaveBeenCalled()
      expect(wrapper.vm.searchInputVisible).toBe(true)
    })

    it('hides search bar', async () => {
      const closeIcon = wrapper.find('.account-nav .nav-close')
      closeIcon.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.searchInputVisible).toBe(false)
      expect(hideSearchbarSpy).toHaveBeenCalled()
    })

    it('search bar closes when a link is clicked', async () => {
      // First, open search bar while sidebar is open
      wrapper.vm.showSidebar()
      await wrapper.vm.$nextTick()
      const searchIcon = wrapper.find('.search-icon')
      searchIcon.trigger('click')
      await wrapper.vm.$nextTick()
      const link = wrapper.find('.sub-item .link')
      link.trigger('click')
      await wrapper.vm.$nextTick()
      expect(hideSearchbarSpy).toHaveBeenCalled()
    })
  })

  describe('tests sidebar visibility toggle', () => {
    it('show sidebar', async () => {
      const html = wrapper.element.parentElement.parentElement
      expect(html.classList.contains('nav-open')).toBe(false)
      const navTrigger = wrapper.find('#nav-trigger')
      navTrigger.trigger('click')
      await wrapper.vm.$nextTick()
      expect(showSidebarSpy).toHaveBeenCalled()
      expect(unstickMenuSpy).toHaveBeenCalled()
      expect(html.classList.contains('nav-open')).toBe(true)
    })

    it('hide sidebar', async () => {
      const body = wrapper.element.parentElement
      const html = body.parentElement
      const activeMenu = body.querySelector('.has-sub-items.active')
      const navClose = wrapper.find('.primary-nav .nav-items > .nav-close')
      navClose.trigger('click')
      await wrapper.vm.$nextTick()
      expect(hideSidebarSpy).toHaveBeenCalled()
      expect(unstickMenuSpy).toHaveBeenCalled()
      expect(html.classList.contains('nav-open')).toBe(false)
      jest.runAllTimers()
      if (activeMenu) {
        expect(activeMenu.classList.contains('active')).toBe(false)
      }
    })
  })

  describe('test fetch()', () => {
    const wrapper = wrapperBuilder.build()

    it('runs the fetch hook', async () => {
      await GlobalHeader.fetch.call(wrapper.vm)

      expect(setRecommendedProductsMockFn).toHaveBeenCalled()
      expect(getBlogCategories).toHaveBeenCalled()
    })
  })
})
