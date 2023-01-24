<template>
  <section>
    <div class="account">
      <account-header />
      <section v-if="address" class="account__content">
        <form @submit.prevent="editShippingAddress">
          <fieldset class="address-input-group">
            <p
              class="address-input-group__section address-input-group__section--first_name"
            >
              <label>First Name</label>
              <input v-model="address.first_name" type="text" required />
            </p>
            <p
              class="address-input-group__section address-input-group__section--last_name"
            >
              <label>Last Name</label>
              <input v-model="address.last_name" type="text" required />
            </p>
            <p
              class="address-input-group__section address-input-group__section--company"
            >
              <label>Company</label>
              <input v-model="address.company" type="text" />
            </p>
            <p
              class="address-input-group__section address-input-group__section--address1"
            >
              <label>Address 1</label>
              <input v-model="address.address1" type="text" required />
            </p>
            <p
              class="address-input-group__section address-input-group__section--address2"
            >
              <label>Address 2</label>
              <input v-model="address.address2" type="text" />
            </p>
            <p
              class="address-input-group__section address-input-group__section--province"
            >
              <label>Province</label>
              <select v-model="address.province">
                <option
                  v-for="(state, index) in states"
                  :key="index"
                  :value="state"
                  :selected="state === address.province"
                >
                  {{ state }}
                </option>
              </select>
            </p>
            <p
              class="address-input-group__section address-input-group__section--city"
            >
              <label>City</label>
              <input v-model="address.city" type="text" required />
            </p>
            <p
              class="address-input-group__section address-input-group__section--zip"
            >
              <label>Zip</label>
              <input v-model="address.zip" type="text" required />
            </p>
            <p
              class="address-input-group__section address-input-group__section--phone"
            >
              <label>Phone</label>
              <input v-model="address.phone" type="text" />
            </p>
          </fieldset>
          <input v-model="address.country" type="hidden" />
          <input type="submit" value="save" />
        </form>
      </section>
    </div>
    <div v-if="isFormSubmitted" class="cart__loader">
      <div class="lds-dual-ring"></div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  middleware: 'authenticated',
  data() {
    return {
      address: null,
      isFormSubmitted: false
    }
  },
  computed: {
    ...mapState('account', ['addresses']),
    ...mapState('commons', ['states'])
  },
  mounted() {
    // eslint-disable-next-line eqeqeq
    const addr = this.addresses.find(({ id }) => id == this.$route.params.id)
    this.address = {
      first_name: addr.first_name,
      last_name: addr.last_name,
      address1: addr.address1,
      address2: addr.address2,
      city: addr.city,
      company: addr.company,
      country: addr.country,
      phone: addr.phone,
      province: addr.province,
      zip: addr.zip
    }
  },
  methods: {
    ...mapActions('account', ['editAddress']),
    editShippingAddress() {
      this.isFormSubmitted = true
      this.editAddress({
        id: this.$route.params.id,
        data: this.address
      }).then(() => {
        this.isFormSubmitted = false
        this.$router.push({ path: '/account' })
      })
    }
  }
}
</script>
<style scoped>
.address-input-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 1.45em;
  max-width: 40rem;
}

.address-input-group__section {
  flex-basis: calc(50% - 14px);
  margin-bottom: 0;
}

.address-input-group__section--address1,
.address-input-group__section--company,
.address-input-group__section--country,
.address-input-group__section--phone {
  flex-basis: 100%;
}

.address-input-group__input {
  margin-bottom: 0;
}
</style>
