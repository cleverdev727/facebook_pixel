import fetch from 'isomorphic-unfetch'
import * as Cookies from 'es-cookie'

import {
  set as setCookie,
  get as getCookie,
  remove as removeCookie
} from 'es-cookie'
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_RENEW,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_CREATE,
  GET_CUSTOMER,
  CUSTOMER_RECOVER,
  CUSTOMER_RESET
} from '../gql'

// The strict mode withholds the cookie from any kind of cross-site usage (including inbound links from external sites).
const sameSite = 'strict'

// Either true or false, indicating if the cookie transmission requires a secure protocol (https).
const secure = process.env.NODE_ENV !== 'development'

async function accountClientPost({
  query,
  variables,
  myshopifyDomain,
  shopifyToken
}) {
  if (!myshopifyDomain) {
    throw new Error(`Missing 'myshopifyDomain' in publicRuntimeConfig`)
  }

  if (!shopifyToken) {
    throw new Error(`Missing 'shopifyToken' in publicRuntimeConfig`)
  }
  const url = `https://${myshopifyDomain}/api/2020-04/graphql`
  const body = JSON.stringify({ query, variables })

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyToken
    },
    body
  })
  return response.json()
}

function apiGet({ baseUrl, urlPath, authTokens }) {
  if (!authTokens) {
    throw new Error(`Missing 'lolaToken' in publicRuntimeConfig`)
  }
  if (!baseUrl) {
    throw new Error(`Missing 'apiBaseUrl' in publicRuntimeConfig`)
  }
  if (!urlPath) {
    throw new Error(`Missing 'url path'`)
  }

  const url = baseUrl.concat(urlPath)
  const authToken = authTokens[Math.floor(Math.random() * authTokens.length)]

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Lola-Access-Token': authToken
    }
  }).then((res) => {
    if (res.status >= 200 && res.status <= 299) {
      return res.json()
    } else {
      throw new Error(res.statusText)
    }
  })
}

function apiPost({ baseUrl, urlPath, authTokens, data = {} }) {
  if (!authTokens) {
    throw new Error(`Missing 'lolaToken' in publicRuntimeConfig`)
  }
  if (!baseUrl) {
    throw new Error(`Missing 'apiBaseUrl' in publicRuntimeConfig`)
  }
  if (!urlPath) {
    throw new Error(`Missing 'url path'`)
  }

  const authToken = authTokens[Math.floor(Math.random() * authTokens.length)]
  const url = baseUrl.concat(urlPath)
  const body = JSON.stringify(data)
  return fetch(url, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      'X-Lola-Access-Token': authToken
    }
  }).then((res) => {
    if (res.status >= 200 && res.status <= 299) {
      return res.json()
    } else {
      throw new Error(res.statusText)
    }
  })
}

function apiDelete({ baseUrl, urlPath, authTokens }) {
  if (!authTokens) {
    throw new Error(`Missing 'lolaToken' in publicRuntimeConfig`)
  }
  if (!baseUrl) {
    throw new Error(`Missing 'apiBaseUrl' in publicRuntimeConfig`)
  }
  if (!urlPath) {
    throw new Error(`Missing 'url path'`)
  }

  const url = baseUrl.concat(urlPath)
  const authToken = authTokens[Math.floor(Math.random() * authTokens.length)]

  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Lola-Access-Token': authToken
    }
  }).then((res) => {
    if (!res.status >= 200 && !res.status <= 299) {
      throw new Error(res.statusText)
    }
    return res
  })
}

export const state = () => ({
  customer: null,
  onetimes: [],
  subscriptions: [],
  addresses: [],
  orders: [],
  paymentSources: [],
  customerAccessToken: null,
  userErrors: [],
  accountNotification: {
    type: null,
    message: null
  }
})

export const mutations = {
  setErrors(state, userErrors) {
    if (userErrors) {
      state.userErrors =
        userErrors.map((err) => {
          if (err.message === 'Unidentified customer') {
            err.message = 'Incorrect email or password.'
          }
          if (err.message === 'Email has already been taken') {
            err.message =
              'This email address is already associated with an account. If this account is yours, you can reset your password'
          }
          if (err.message === 'Could not find customer') {
            err.message =
              'Account not found. Have a subscription, or ordered with us previously? Try activating your account below.'
          }
          return err
        }) || []
    }
  },
  setCustomer(state, customer) {
    state.customer = customer
  },
  setCustomerAccessToken(state, customerAccessToken) {
    state.customerAccessToken = customerAccessToken
  },
  setSubscriptions(state, subscriptions) {
    state.subscriptions = subscriptions
  },
  setAddresses(state, addresses) {
    state.addresses = addresses
  },
  setOrders(state, orders) {
    state.orders = orders
  },
  setPaymentSources(state, paymentSources) {
    state.paymentSources = paymentSources
  },
  setOnetimes(state, onetimes) {
    state.onetimes = onetimes
  },
  setAccountNotification(state, notification) {
    state.accountNotification = notification
  }
}

export const actions = {
  updateCustomerAccessToken({ commit }, customerAccessToken) {
    const { accessToken, expiresAt } = customerAccessToken
    const expires = new Date(expiresAt)
    expires.setHours(expires.getHours())
    setCookie('customerAccessToken', accessToken, { expires, secure, sameSite })
    commit('setCustomerAccessToken', customerAccessToken)
  },

  removeCustomerAccessToken({ commit }) {
    removeCookie('customerAccessToken')
    removeCookie('ncl')
    commit('setCustomerAccessToken', null)
  },

  removeCustomerData({ commit }) {
    commit('setCustomer', null)
    commit('setSubscriptions', [])
    commit('setAddresses', [])
    commit('setOrders', [])
    commit('setPaymentSources', [])
    commit('setOnetimes', [])
    Cookies.remove('nacelle_yotpo_user')
  },

  async readCustomerAccessToken({ dispatch, commit }, { accessToken }) {
    if (accessToken) {
      commit('setCustomerAccessToken', { accessToken, expiresAt: null })
      await dispatch('renewCustomerAccessToken', accessToken)
    }
  },

  async renewCustomerAccessToken({ commit, dispatch }, payload) {
    try {
      const variables = { customerAccessToken: payload }
      const query = CUSTOMER_ACCESS_TOKEN_RENEW
      const { myshopifyDomain, shopifyToken } = this.$config
      const response = await accountClientPost({
        query,
        variables,
        myshopifyDomain,
        shopifyToken
      })
      const { customerAccessToken, userErrors } =
        response.data.customerAccessTokenRenew
      if (customerAccessToken && customerAccessToken.accessToken) {
        await dispatch('updateCustomerAccessToken', customerAccessToken)
        await dispatch('fetchCustomer')
      } else {
        // access token does not exist
        dispatch('removeCustomerAccessToken')
        dispatch('removeCustomerData')
      }
      commit('setErrors', userErrors)
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  async fetchRechargeData({ state, commit, dispatch }) {
    try {
      const email = encodeURIComponent(state.customer.email)
      const portfolio = await apiGet({
        baseUrl: this.$config.apiBaseUrl,
        urlPath: `/recharge/customers/portfolio?email=${email}`,
        authTokens: [
          this.$config.lolaToken,
          this.$config.lolaToken2,
          this.$config.lolaToken3
        ]
      })

      const { customer } = portfolio.find((data) => data.customer)
      const { addresses } = portfolio.find((data) => data.addresses)
      const { subscriptions } = portfolio.find((data) => data.subscriptions)
      const { orders } = portfolio.find((data) => data.orders)
      const { onetimes } = portfolio.find((data) => data.onetimes)
      const { paymentSources } = portfolio.find((data) => data.paymentSources)

      const updatedCustomer = {
        ...state.customer,
        rechargeId: customer.id,
        hash: customer.hash
      }
      commit('setCustomer', updatedCustomer)
      commit('setAddresses', addresses)
      commit('setOrders', orders)
      commit('setSubscriptions', subscriptions)
      commit('setOnetimes', onetimes)
      commit('setPaymentSources', paymentSources)
    } catch (err) {
      if (err.message && err.message === 'Not Found') {
        // create recharge customer
        const data = {
          first_name: state.customer.firstName,
          last_name: state.customer.lastName,
          email: state.customer.email,
          external_customer_id: {
            ecommerce: state.customer.id
          }
        }
        await dispatch('createCustomer', data)
      } else {
        throw new Error(err)
      }
    }
  },

  async fetchCustomer({ state, commit }) {
    const variables = {
      customerAccessToken: state.customerAccessToken.accessToken
    }
    const query = GET_CUSTOMER
    const { myshopifyDomain, shopifyToken } = this.$config
    const response = await accountClientPost({
      query,
      variables,
      myshopifyDomain,
      shopifyToken
    })
    const { customer, userErrors } = response.data

    if (userErrors) {
      commit('setErrors', userErrors)
      throw new Error(userErrors)
    }

    if (customer) {
      // Transform customer Id
      const data = atob(customer.id)
      const id = data.replace('gid://').split('/').pop()
      customer.id = id
      const yotpoUser = {
        customerId: customer.id,
        customerEmail: customer.email,
        customerTags: customer.tags
      }
      Cookies.set('nacelle_yotpo_user', btoa(JSON.stringify(yotpoUser)), {
        expires: 30
      })
      commit('setCustomer', customer)
    }
  },

  async login({ commit, dispatch, state }, { email, password }) {
    try {
      const variables = { input: { email, password } }
      const query = CUSTOMER_ACCESS_TOKEN_CREATE
      const { myshopifyDomain, shopifyToken } = this.$config
      const response = await accountClientPost({
        query,
        variables,
        myshopifyDomain,
        shopifyToken
      })
      const { customerAccessToken, userErrors } =
        response.data.customerAccessTokenCreate
      if (customerAccessToken) {
        await dispatch('updateCustomerAccessToken', customerAccessToken)
        await dispatch('fetchCustomer')
        await dispatch('fetchRechargeData')
      } else {
        commit('setErrors', userErrors)
        dispatch('removeCustomerAccessToken')
        throw new Error(userErrors)
      }
    } catch (err) {
      if (state.userErrors.length === 0) {
        commit('setErrors', [{ message: 'Oops! something went wrong' }])
      }
      dispatch('removeCustomerAccessToken')
      throw new Error('Oops! something went wrong')
    }
  },

  async register({ commit, dispatch }, payload) {
    commit('setErrors', [])
    const { firstName, lastName, email, password } = payload
    const variables = { input: { firstName, lastName, email, password } }
    const query = CUSTOMER_CREATE
    const { myshopifyDomain, shopifyToken } = this.$config
    const response = await accountClientPost({
      query,
      variables,
      myshopifyDomain,
      shopifyToken
    })

    const { data } = response
    const { customerUserErrors, customer } = data.customerCreate
    if (customer) {
      const ecommerce = atob(customer.id).replace('gid://').split('/').pop()

      const data = {
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        external_customer_id: {
          ecommerce
        }
      }
      await dispatch('createCustomer', data)
    }
    commit('setErrors', customerUserErrors)
  },

  async recover({ commit }, { email }) {
    commit('setErrors', [])
    const variables = { email }
    const query = CUSTOMER_RECOVER
    const { myshopifyDomain, shopifyToken } = this.$config
    const response = await accountClientPost({
      query,
      variables,
      myshopifyDomain,
      shopifyToken
    })

    const { data } = response
    const { customerUserErrors } = data.customerRecover
    commit('setErrors', customerUserErrors)
  },

  async reset({ commit }, { password, resetToken, customerId }) {
    commit('setErrors', [])
    const id = Buffer.from(`gid://shopify/Customer/${customerId}`).toString(
      'base64'
    )
    const variables = { id, input: { password, resetToken } }
    const query = CUSTOMER_RESET
    const { myshopifyDomain, shopifyToken } = this.$config
    const response = await accountClientPost({
      query,
      variables,
      myshopifyDomain,
      shopifyToken
    })
    const { data } = response
    const { customerUserErrors } = data.customerReset

    commit('setErrors', customerUserErrors)
  },

  async logout({ state, dispatch, commit }) {
    const accessToken =
      (state.customerAccessToken && state.customerAccessToken.accessToken) ||
      getCookie('customerAccessToken')
    const variables = { customerAccessToken: accessToken }
    const query = CUSTOMER_ACCESS_TOKEN_DELETE
    const { myshopifyDomain, shopifyToken } = this.$config
    const response = await accountClientPost({
      query,
      variables,
      myshopifyDomain,
      shopifyToken
    })
    const { data } = response
    if (data.customerAccessTokenDelete) {
      const { deletedAccessToken, userErrors } = data.customerAccessTokenDelete
      if (deletedAccessToken) {
        dispatch('removeCustomerAccessToken')
      }
      commit('setErrors', userErrors)
    }
    dispatch('removeCustomerAccessToken')
    dispatch('removeCustomerData')
  },

  async editCustomer({ state, commit }, { data }) {
    const { customer } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/customers/${state.customer.rechargeId}`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })
    if (customer) {
      const { first_name: fn, last_name: ln } = customer
      const updatedCustomer = { ...state.customer }
      updatedCustomer.firstName = fn
      updatedCustomer.lastName = ln
      commit('setCustomer', updatedCustomer)

      return updatedCustomer
    }
    return state.customer
  },

  async editAddress({ state, commit }, { id, data }) {
    const { address } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/addresses/${id}`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })

    const updatedAddresses = state.addresses.map((a) =>
      a.id === address.id ? address : a
    )
    commit('setAddresses', updatedAddresses)
  },

  async createSubscription({ state, commit }, { data }) {
    const { subscription } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/subscriptions`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })

    const subs = [...state.subscriptions]
    subs.push(subscription)

    commit('setSubscriptions', subs)
  },

  async editSubscription({ state, commit }, { id, data }) {
    const { subscription } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/subscriptions/${id}`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })

    const updatedSubscription = state.subscriptions.map((s) =>
      s.id === subscription.id ? subscription : s
    )
    commit('setSubscriptions', updatedSubscription)
  },

  async activateSubscription({ state, commit }, { id }) {
    const { subscription: sub } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/subscriptions/${id}/activate`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ]
    })

    const subscriptions = state.subscriptions.map((subscription) =>
      subscription.id === sub.id ? sub : subscription
    )
    commit('setSubscriptions', subscriptions)
  },

  async editAddressSubscriptions({ state, commit }, { id, data }) {
    const { subscriptions: subs } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/addresses/${id}/subscriptions-bulk`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })

    const subsNotInAddress = state.subscriptions.filter(
      ({ address_id: a, sku }) => a !== id || sku === 'LOLA Membership'
    )

    commit('setSubscriptions', subsNotInAddress.concat(subs))
  },

  async createOnetime({ state, commit }, { addressId, data }) {
    const { onetime } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/onetimes/address/${addressId}`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })

    const onetimes = [...state.onetimes]
    onetimes.push(onetime)

    commit('setOnetimes', onetimes)
  },

  async editOnetime({ state, commit }, { id, data }) {
    const { onetime } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/onetimes/${id}`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })

    const onetimes = state.onetimes.map((o) =>
      o.id === onetime.id ? onetime : o
    )
    commit('setOnetimes', onetimes)
  },

  async removeOnetime({ state, commit }, id) {
    await apiDelete({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/onetimes/${id}`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ]
    })
    const ot = state.onetimes.filter((onetime) => onetime.id !== id)

    commit('setOnetimes', ot)
  },

  editPaymentSources({ state, commit }, { i, paymentSource }) {
    const paymentSources = [...state.paymentSources]
    paymentSources[i] = paymentSource
    commit('setPaymentSources', paymentSources)
  },

  async renewalDateTracking(_, { data }) {
    await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: '/snowflake/pause',
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })
  },

  async addAddressDiscount({ state, commit }, { id, data }) {
    const { address } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/addresses/${id}/apply_discount`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })
    if (address) {
      const updatedAddresses = state.addresses.map((a) =>
        a.id === address.id ? address : a
      )
      commit('setAddresses', updatedAddresses)
    }
  },

  async removeAddressDiscount({ state, commit }, { data }) {
    const { address } = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: `/recharge/addresses/remove_discount`,
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })
    if (address) {
      const updatedAddresses = state.addresses.map((a) =>
        a.id === address.id ? address : a
      )
      commit('setAddresses', updatedAddresses)
    }
  },

  async activate(_, email) {
    const data = { email }
    const response = await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: '/shopify/activate',
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data
    })
    return response
  },

  async createCustomer(_, customer) {
    await apiPost({
      baseUrl: this.$config.apiBaseUrl,
      urlPath: '/recharge/customers/',
      authTokens: [
        this.$config.lolaToken,
        this.$config.lolaToken2,
        this.$config.lolaToken3
      ],
      data: customer
    })
  }
}

export default {
  state,
  mutations,
  actions,
  namespaced: true
}
