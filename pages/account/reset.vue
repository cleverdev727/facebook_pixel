<template>
  <div class="authentication authentication-reset">
    <h2 class="decorated-heading">Reset account password</h2>
    <div class="mx-auto">
      <form method="post" @submit.prevent="resetPassword">
        <div v-if="errorMessage">
          <p class="errors" v-html="errorMessage"></p>
        </div>
        <div v-if="userErrors.length" class="errors">
          <ul>
            <li v-for="(error, index) in userErrors" :key="index">
              {{ error.message }}
            </li>
          </ul>
        </div>
        <p>
          <label class="authentication__label"> New Password </label>
          <input
            v-model="form.password"
            type="password"
            class="input-alternate"
            placeholder="Password"
            required
          />
        </p>
        <p>
          <label class="authentication__label"> Confirm Password </label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="input-alternate"
            placeholder="Confirm password"
            required
          />
        </p>
        <input
          type="submit"
          :disabled="isSubmitted"
          class="authentication__submit button"
          value="Reset password"
        />
      </form>
      <div v-show="isSubmitted" class="cart__loader">
        <div class="lds-dual-ring"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  asyncData({ store }) {
    store.commit('account/setErrors', [])
  },
  data() {
    return {
      form: {
        password: '',
        confirmPassword: '',
        resetToken: '',
        customerId: ''
      },
      isSubmitted: false,
      errorMessage: ''
    }
  },
  computed: {
    ...mapState('account', ['userErrors'])
  },
  mounted() {
    /* eslint-disable camelcase */
    const { customer_id, token } = this.$route.query
    if (!customer_id || !token) {
      this.$router.push({ path: '/' })
    } else {
      this.form.customerId = customer_id
      this.form.resetToken = token
    }
  },
  methods: {
    ...mapActions('account', ['reset']),
    resetPassword() {
      this.errorMessage = ''
      const { password, confirmPassword } = this.form
      if (password !== confirmPassword) {
        this.errorMessage = 'Passwords do NOT match'
      } else {
        this.isSubmitted = true
        this.reset(this.form)
          .then(() => {
            this.isSubmitted = false
            this.$router.push({ path: '/account/login' })
          })
          .catch(() => {
            this.isSubmitted = false
            this.form.password = ''
            this.form.confirmPassword = ''
            this.errorMessage = `An error occurred, please contact us at <a href="mailto:help@mylola.com?subject=Lola password reset"
            style="cursor: pointer"
            >help@mylola.com</a>`
          })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '/assets/scss/base/_variables.scss';
$_authentication-max-width: 550px;
.authentication {
  animation-duration: 600ms;
  animation-name: authentication-fade-in;
  animation-timing-function: ease-out;
  color: $action-color;
  min-height: 500px;
  text-align: center;

  .decorated-heading {
    text-align: center;
    margin-bottom: 0;
    line-height: 1.2;
  }

  .authentication__label {
    margin-bottom: 1rem;
    margin-top: 1rem;
    text-align: left;
  }

  .authentication__submit {
    display: block;
    margin-bottom: 1rem;
    margin-top: 2rem;
    width: 100%;
  }

  .errors {
    background-color: #ffebee;
    padding: 4px;
  }
}

.authentication-reset {
  margin: 4rem auto 6rem;
  max-width: $_authentication-max-width;
  padding-left: $gutter--base;
  padding-right: $gutter--base;
}
</style>
