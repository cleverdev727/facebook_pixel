<template>
  <div class="authentication authentication-register">
    <h1 class="decorated-heading">Welcome to LOLA!</h1>
    <div class="mx-auto">
      <form
        method="post"
        accept-charset="UTF-8"
        novalidate="novalidate"
        @submit.prevent="registerCustomer"
      >
        <div v-if="userErrors.length" class="errors">
          <ul>
            <li v-for="(error, index) in userErrors" :key="index">
              {{ error.message }}
            </li>
          </ul>
        </div>
        <div v-if="userErrors.length" class="buttons grid">
          <nuxt-link
            to="/account/login"
            class="button button--stripped text--no-decoration"
            >login</nuxt-link
          >
          <nuxt-link
            to="/account/activate"
            class="button button--stripped text--no-decoration"
            >Activate account</nuxt-link
          >
        </div>

        <p>
          <label class="authentication__label"> First name </label>
          <input
            v-model="form.firstName"
            type="text"
            class="input-alternate"
            placeholder="First name"
            spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            required=""
            autofocus=""
          />
        </p>

        <p>
          <label class="authentication__label"> Last name </label>
          <input
            v-model="form.lastName"
            type="text"
            class="input-alternate"
            placeholder="Last name"
            spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            required=""
            autofocus=""
          />
        </p>

        <p>
          <label class="authentication__label"> Email </label>
          <input
            v-model="form.email"
            type="email"
            class="input-alternate"
            placeholder="Email"
            spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            required=""
            autofocus=""
          />
        </p>
        <p>
          <label class="authentication__label"> Password </label>
          <input
            v-model="form.password"
            type="password"
            class="input-alternate"
            placeholder="Password"
            required=""
          />
        </p>
        <input
          type="submit"
          :disabled="isSubmitted"
          class="authentication__submit button"
          value="Next"
        />
        <p>
          By clicking NEXT you agree to the LOLA
          <nuxt-link to="/terms-conditions">Terms of Service</nuxt-link>.
        </p>
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
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      isSubmitted: false,
      errorMessage: null
    }
  },
  computed: {
    ...mapState('account', ['userErrors'])
  },
  methods: {
    ...mapActions('account', ['register', 'login']),
    registerCustomer() {
      this.isSubmitted = true
      this.register(this.form)
        .then(() => {
          if (this.userErrors.length > 0) {
            this.scrollToTop()
            this.isSubmitted = false
            this.form.email = ''
            this.form.password = ''
          } else {
            this.isSubmitted = false
            this.$router.push({ path: '/account/login' })
          }
        })
        .catch((e) => {
          this.$router.push({ path: '/' })
        })
    },
    scrollToTop() {
      window.scrollTo(0, 0)
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

  .grid {
    display: grid;
    grid-gap: 28px;
    grid-template-columns: repeat(2, 1fr);
  }

  form {
    .errors {
      background-color: #ffebee;
      padding: 4px;
      margin-bottom: 1em;
    }
  }
}

.authentication-register {
  margin: 4rem auto 6rem;
  max-width: $_authentication-max-width;
  padding-left: $gutter--base;
  padding-right: $gutter--base;
}
</style>
