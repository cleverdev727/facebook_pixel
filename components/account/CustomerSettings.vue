<template>
  <div class="account__settings">
    <div class="account__billing">
      <client-only>
        <div v-if="paymentSources && customer">
          <h2>Billing</h2>
          <div class="account__section">
            <h3 class="account__title">Payment method</h3>
            <div v-if="notCardLast4">
              <div class="account__payment-visa">
                <p>Card was removed or expired.</p>
                <button
                  v-if="!isCardExipredEdit"
                  class="account__details-edit"
                  @click="toggleIsCardExpiredEdit"
                >
                  Update card
                </button>
                <form v-if="isCardExipredEdit">
                  <span
                    class="account__form-dismiss"
                    @click="toggleIsCardExpiredEdit"
                    >&times;</span
                  >
                  <iframe
                    id="customer-card-form"
                    frameborder="0"
                    allowtransparency="true"
                    :src="
                      'https://admin.rechargeapps.com/customer_portal_payment_source_form/' +
                      customer.hash +
                      '/payment_source'
                    "
                  ></iframe>
                </form>
              </div>
            </div>
            <div v-else-if="notPaypal">
              <div class="account__payment-visa">
                <p v-if="!isEditPaymentInfo">
                  {{ paymentSources[0].cardholder_name }}<br />
                  {{ paymentSources[0].card_brand | capitalize }} ending in
                  {{ paymentSources[0].card_last4 }}<br />
                  Expires {{ paymentSources[0].card_exp_month }}/{{
                    paymentSources[0].card_exp_year
                  }}<br />
                </p>
                <p v-if="!isEditPaymentInfo">
                  <button class="account__details-edit" @click="togglePayment">
                    Edit
                  </button>
                </p>
                <form v-if="isEditPaymentInfo">
                  <span class="account__form-dismiss" @click="togglePayment"
                    >&times;</span
                  >
                  <iframe
                    id="customer-card-form"
                    frameborder="0"
                    allowtransparency="true"
                    :src="
                      'https://admin.rechargeapps.com/customer_portal_payment_source_form/' +
                      customer.hash +
                      '/payment_source'
                    "
                  ></iframe>
                </form>
              </div>
            </div>
            <div v-else-if="applePay">
              <h4>Linked Apple Pay</h4>
              <p>
                If you need to update your payment settings, navigate to
                Settings > Wallet &amp; Apple Pay on your mobile device.
              </p>
              <p>
                Learn more about
                <a
                  href="https://support.apple.com/en-us/HT205583"
                  target="_blank"
                  >Apple Pay</a
                >.
              </p>
            </div>
            <p v-else>PayPal ({{ customer.email }})</p>
          </div>
          <div class="account__section">
            <h3 class="account__title">Billing address</h3>
            <div>
              <div v-if="!isEditBillingInfo" class="account__billing-info">
                <p>
                  {{ paymentSources[0].billing_address.first_name }}
                  {{ paymentSources[0].billing_address.last_name }}<br />
                  <span v-if="paymentSources[0].billing_address.company">
                    {{ paymentSources[0].billing_address.company }}<br />
                  </span>
                  {{ paymentSources[0].billing_address.address1 }}
                  {{ paymentSources[0].billing_address.address2 }}<br />
                  {{ paymentSources[0].billing_address.city }}
                  {{ paymentSources[0].billing_address.province }}
                  {{ paymentSources[0].billing_address.zip }}<br />
                  {{ paymentSources[0].billing_address.country }}<br />
                </p>
                <p>
                  <button class="account__details-edit" @click="toggleBilling">
                    Edit
                  </button>
                </p>
              </div>
              <form
                v-if="isEditBillingInfo"
                method="post"
                @submit.prevent="editBillingInfo"
              >
                <span class="account__form-dismiss" @click="toggleBilling"
                  >&times;</span
                >
                <fieldset>
                  <div class="grid">
                    <div class="grid__item medium-up--one-half">
                      <label for="billing_first_name">First name</label>
                      <input
                        v-model="billing.billing_first_name"
                        type="text"
                        disabled
                      />
                    </div>
                    <div class="grid__item medium-up--one-half">
                      <label for="billing_last_name">Last name</label>
                      <input
                        v-model="billing.billing_last_name"
                        type="text"
                        disabled
                      />
                    </div>
                  </div>
                  <label for="billing_address1">Billing address 1</label>
                  <input v-model="billing.billing_address1" type="text" />
                  <label for="billing_address2">Billing address 2</label>
                  <input v-model="billing.billing_address2" type="text" />
                  <label for="billing_company">Company</label>
                  <input v-model="billing.billing_company" type="text" />
                  <div class="grid">
                    <div class="grid__item medium-up--one-half">
                      <label for="billing_city">City</label>
                      <input v-model="billing.billing_city" type="text" />
                    </div>
                    <div class="grid__item medium-up--one-half">
                      <label for="billing_province">State/province</label>
                      <select v-model="billing.billing_province">
                        <option
                          v-for="(state, index) in states"
                          :key="index"
                          :value="state"
                          :selected="state === billing.billing_province"
                        >
                          {{ state }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="grid">
                    <div class="grid__item medium-up--one-half">
                      <label for="billing_zip">Zip/postal code</label>
                      <input v-model="billing.billing_zip" type="text" />
                    </div>
                    <div class="grid__item medium-up--one-half">
                      <label for="billing_country">Country</label>
                      <input v-model="billing.billing_country" type="text" />
                    </div>
                  </div>
                  <label for="billing_phone">Phone</label>
                  <input v-model="billing.billing_phone" type="text" />
                </fieldset>
                <br />
                <button type="submit">Save</button>
              </form>
            </div>
          </div>
        </div>
      </client-only>
      <div v-if="addrs">
        <h2>Shipping</h2>
        <div>
          <h3 class="account__title">Shipping addresses</h3>
          <p id="shipping_addresses"></p>
          <div v-for="(address, i) in addrs" :key="address.id">
            <div class="account__billing-info">
              <p>
                {{ address.first_name }} {{ address.last_name }}<br />
                {{ address.address1 }} {{ address.address2 }}<br />
                {{ address.city }} {{ address.province }} {{ address.zip
                }}<br />
                {{ address.country }}<br />
              </p>
              <p>
                <button
                  class="account__details-edit"
                  @click="toggleShipping('shippingAddress' + address.id)"
                >
                  Edit
                </button>
              </p>
            </div>
            <form
              :ref="'shippingAddress' + address.id"
              method="post"
              style="display: none"
              @submit.prevent="editShippingAddress(i, addrs[i].id)"
            >
              <span
                class="account__form-dismiss"
                @click="dismissShipping('shippingAddress' + address.id)"
                >&times;</span
              >
              <fieldset class="address-input-group">
                <p
                  class="address-input-group__section address-input-group__section--first_name"
                >
                  <label>First name</label>
                  <input v-model="addrs[i].first_name" type="text" />
                </p>
                <p
                  class="address-input-group__section address-input-group__section--last_name"
                >
                  <label>Last name</label>
                  <input v-model="addrs[i].last_name" type="text" />
                </p>
                <p
                  class="address-input-group__section address-input-group__section--company"
                >
                  <label>Company</label>
                  <input v-model="addrs[i].company" type="text" />
                </p>
                <p
                  class="address-input-group__section address-input-group__section--address1"
                >
                  <label>Address 1</label>
                  <input v-model="addrs[i].address1" type="text" />
                </p>
                <p
                  class="address-input-group__section address-input-group__section--address2"
                >
                  <label>Address 2</label>
                  <input v-model="addrs[i].address2" type="text" />
                </p>
                <p
                  class="address-input-group__section address-input-group__section--province"
                >
                  <label>State/Province</label>
                  <select v-model="addrs[i].province">
                    <option
                      v-for="(state, index) in states"
                      :key="index"
                      :value="state"
                      :selected="state === addrs[i].province"
                    >
                      {{ state }}
                    </option>
                  </select>
                </p>
                <p
                  class="address-input-group__section address-input-group__section--city"
                >
                  <label>City</label>
                  <input v-model="addrs[i].city" type="text" />
                </p>
                <p
                  class="address-input-group__section address-input-group__section--zip"
                >
                  <label>Zip/Postal code</label>
                  <input v-model="addrs[i].zip" type="text" />
                </p>
                <p
                  class="address-input-group__section address-input-group__section--phone"
                >
                  <label>Phone</label>
                  <input v-model="addrs[i].phone" type="text" />
                </p>
              </fieldset>
              <input v-model="addrs[i].country" type="hidden" />
              <input v-model="addrs[i].cart_note" type="hidden" />
              <input
                type="submit"
                class="update-shipping-address"
                value="Save"
              />
            </form>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2>Account</h2>
      <div class="account__details">
        <div>
          <h3 class="account__login">Login and security</h3>
          <client-only>
            <div v-if="customer && !isEditCustomer">
              <div class="account__details-item">
                <div>
                  <span class="account__details-title">Name</span>
                  <span class="account__details-value"
                    >{{ customer.firstName }} {{ customer.lastName }}</span
                  >
                </div>
                <button
                  class="account__details-edit"
                  @click="editCustomerDetails"
                >
                  Edit
                </button>
              </div>
              <div class="account__details-item">
                <div>
                  <span class="account__details-title">Email</span>
                  <span class="account__details-value">
                    {{ customer.email }}
                  </span>
                </div>
              </div>
            </div>
          </client-only>
          <form v-if="isEditCustomer" method="post" @submit.prevent="update">
            <span class="account__form-dismiss" @click="toggleCustomerEdit"
              >×</span
            >
            <fieldset>
              <div class="grid">
                <div class="grid__item medium-up--one-half">
                  <label for="first_name">First name</label>
                  <input v-model="firstName" type="text" />
                </div>
                <div class="grid__item medium-up--one-half">
                  <label for="last_name">Last name</label>
                  <input v-model="lastName" type="text" />
                </div>
              </div>
            </fieldset>
            <br />
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>

    <div class="account__logout">
      <nuxt-link to="/" class="button" @click.native="handleLogout">
        Log out
      </nuxt-link>
    </div>
    <div v-if="isFormSubmitted" class="cart__loader">
      <div class="lds-dual-ring"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  data() {
    return {
      addrs: null,
      billing: null,
      firstName: '',
      lastName: '',
      isEditCustomer: false,
      isEditBillingInfo: false,
      isCardExipredEdit: false,
      isEditPaymentInfo: false,
      isFormSubmitted: false
    }
  },
  computed: {
    ...mapState('account', [
      'customer',
      'addresses',
      'paymentSources',
      'subscriptions',
      'onetimes'
    ]),
    ...mapState('commons', ['states']),
    paymentSources: {
      get() {
        return this.$store.state.account.paymentSources
      },
      set(value) {
        this.$store.account.commit('setPaymentSources', value)
      }
    },
    applePay() {
      if (this.paymentSources.length > 0) {
        return this.paymentSources[0].payment_type === 'apple_pay'
      }
      return null
    },
    notPaypal() {
      if (this.paymentSources.length > 0) {
        return (
          this.paymentSources[0].payment_type !== 'paypal' ||
          this.paymentSources[0].card_brand !== 'paypal'
        )
      }
      return null
    },
    notCardLast4() {
      if (this.paymentSources.length > 0) {
        return this.paymentSources[0].card_last4 == null
      }
      return null
    },
    nonmembershipAddresses() {
      const subs = this.subscriptions.filter(
        (sub) => sub.sku !== 'LOLA Membership'
      )
      const addresses = subs.concat(this.onetimes).map((sub) => sub.address_id)
      const uniqueAddresses = [...new Set(addresses)]
      return this.addresses.filter((address) =>
        uniqueAddresses.includes(address.id)
      )
    }
  },
  mounted() {
    const { billing_address: billing } = JSON.parse(
      JSON.stringify(this.paymentSources[0])
    )

    this.billing = {
      billing_first_name: billing.first_name,
      billing_last_name: billing.last_name,
      billing_address1: billing.address1,
      billing_address2: billing.address2,
      billing_city: billing.city,
      billing_company: billing.company,
      billing_country: billing.country,
      billing_phone: billing.phone,
      billing_province: billing.province,
      billing_zip: billing.zip
    }
    this.firstName = this.customer.firstName
    this.lastName = this.customer.lastName
    this.addrs = JSON.parse(JSON.stringify(this.nonmembershipAddresses))
  },
  methods: {
    ...mapActions('account', [
      'logout',
      'editCustomer',
      'editAddress',
      'editPaymentSources'
    ]),
    editCustomerDetails() {
      this.isEditCustomer = true
    },
    toggleCustomerEdit() {
      this.isEditCustomer = !this.isEditCustomer
    },
    toggleBilling() {
      this.isEditBillingInfo = !this.isEditBillingInfo
    },
    togglePayment() {
      this.isEditPaymentInfo = !this.isEditPaymentInfo
    },
    toggleIsCardExpiredEdit() {
      this.isCardExipredEdit = !this.isCardExipredEdit
    },
    handleLogout() {
      this.logout().then(() => {
        this.$router.replace({ path: '/' })
      })
    },
    update() {
      this.isFormSubmitted = true
      const data = {
        first_name: this.firstName,
        last_name: this.lastName
      }
      this.editCustomer({ data })
        .then(({ firstName, lastName }) => {
          this.isFormSubmitted = false
          this.firstName = firstName
          this.lastName = lastName
          this.toggleCustomerEdit()
        })
        .catch((err) => console.error(err))
    },
    editBillingInfo() {
      this.isFormSubmitted = true
      this.editCustomer({ data: this.billing })
        .then(() => {
          this.isFormSubmitted = false
          window._iaq.push([
            'track',
            'updateRechargeBillingAddress',
            { address: this.billing }
          ])
          this.toggleBilling()
          const paymentSource = JSON.parse(
            JSON.stringify(this.paymentSources[0])
          )
          paymentSource.billing_address.first_name =
            this.billing.billing_first_name
          paymentSource.billing_address.last_name =
            this.billing.billing_last_name
          paymentSource.billing_address.address1 = this.billing.billing_address1
          paymentSource.billing_address.address2 = this.billing.billing_address2
          paymentSource.billing_address.city = this.billing.billing_city
          paymentSource.billing_address.company = this.billing.billing_company
          paymentSource.billing_address.country = this.billing.billing_country
          paymentSource.billing_address.phone = this.billing.billing_phone
          paymentSource.billing_address.province = this.billing.billing_province
          paymentSource.billing_address.zip = this.billing.billing_zip
          this.editPaymentSources({
            i: 0,
            paymentSource
          })
        })
        .catch((err) => {
          console.error(err)
          this.isFormSubmitted = false
          this.toggleBilling()
        })
    },
    toggleShipping(formId) {
      this.$refs[formId][0].style.display = 'block'
    },
    dismissShipping(formId) {
      this.$refs[formId][0].style.display = 'none'
    },
    editShippingAddress(i, addressId) {
      this.isFormSubmitted = true
      /* eslint-disable camelcase */
      const {
        id,
        address1,
        address2,
        first_name,
        last_name,
        company,
        zip,
        country,
        province,
        city,
        phone
      } = this.addrs[i]
      const data = {
        address1,
        address2,
        first_name,
        last_name,
        company,
        zip,
        country,
        province,
        city,
        phone
      }
      this.editAddress({
        id,
        data
      })
        .then(() => {
          this.isFormSubmitted = false
          this.addrs = JSON.parse(JSON.stringify(this.addresses))
          this.dismissShipping('shippingAddress' + addressId)
          window._iaq.push([
            'track',
            'updateShippingAddress',
            { address: data }
          ])
        })
        .catch(() => {
          this.isFormSubmitted = false
          this.addrs = JSON.parse(JSON.stringify(this.addresses))
          this.dismissShipping('shippingAddress' + addressId)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.account__settings {
  margin: 2em;

  @media (min-width: $medium-screen) {
    grid-column: 1/3;
  }

  h2 {
    font-size: 28px;
  }

  .account__section {
    padding-bottom: 1em;
  }

  .account__title {
    font-size: 20px;
  }

  .account__payment-visa,
  .account__billing-info {
    display: flex;
    justify-content: space-between;
    padding: 0 0.8em;

    @media (min-width: $medium-screen) {
      min-width: 20em;
    }
    #customer-card-form {
      height: 27em;
    }
  }
  .account__payment-visa {
    flex-direction: column;
    p {
      margin: 0;
    }
  }

  #customer-card-form {
    height: 27em;
  }

  .account__billing,
  .account__details {
    @media (min-width: $medium-screen) {
      display: flex;
      justify-content: space-between;
      margin-right: 4em;
    }
  }

  .account__login {
    margin: 0;
  }

  .account__details-item {
    display: flex;
    justify-content: space-between;
    padding: 1.4em 0;

    @media (min-width: $medium-screen) {
      min-width: 20em;
    }
  }

  .account__details-title {
    display: block;
    text-transform: uppercase;
    color: #4e6282;
    font-weight: bold;
  }

  .account__details-value {
    font-size: 15px;
  }

  .account__details-edit {
    text-decoration: underline;
    background: none;
    color: #514945;
    outline: none;
    border: none;
  }

  .account__logout {
    margin: 2em 0;

    @media (min-width: $medium-screen) {
      display: none;
    }
  }

  .account__form-dismiss {
    display: block;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
    margin-left: auto;
    margin-right: 0.4em;
    border: 1px solid #4e6282;
    width: 28px;
    border-radius: 2em;
    text-align: center;
    color: #fff;
    background-color: #4e6282;

    &:hover {
      background: transparent;
      color: #4e6282;
    }
  }
  .grid {
    display: grid;
    grid-gap: 28px;
    grid-template-columns: repeat(2, 1fr);
  }

  .address-input-group {
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-bottom: 1.45em;
    max-width: 40rem;
  }

  .address-input-group__section {
    flex-basis: calc(50% - 14px);
    margin-bottom: 0;
  }

  .update-shipping-address {
    margin-bottom: 1rem;
  }
}
</style>
