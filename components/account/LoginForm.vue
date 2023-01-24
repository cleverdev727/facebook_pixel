<template>
  <div class="authentication-page">
    <div
      v-if="!showPasswordReset"
      id="customerLoginForm"
      class="authentication"
    >
      <section
        v-if="showLogin"
        class="heading-bg flex flex--items-center justify--center"
      >
        <h1 class="decorated-heading text--white">Welcome back!</h1>
      </section>
      <div class="form-container mx-auto">
        <div v-show="showLoginFormLoader" class="cart__loader">
          <div class="lds-dual-ring"></div>
        </div>
        <client-only>
          <form
            method="post"
            accept-charset="UTF-8"
            novalidate="novalidate"
            @submit.prevent="submitForm"
          >
            <div v-if="userErrors.length" class="errors">
              <ul>
                <li v-for="(error, index) in userErrors" :key="index">
                  {{ error.message }}
                </li>
              </ul>
            </div>

            <p>
              <label for="Email" class="authentication__label"> Email </label>
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
              <label for="Password" class="authentication__label">
                Password
              </label>
              <input
                v-model="form.password"
                type="password"
                class="input-alternate"
                placeholder="Password"
                required=""
              />
            </p>
            <button
              :disabled="isSubmitted"
              class="authentication__submit button"
            >
              Next
            </button>
            <nuxt-link
              v-if="showLogin"
              to=""
              class="authentication__recover-password-link text--center"
              @click.native="toggleReset"
            >
              Forgot your password?
            </nuxt-link>
          </form>
        </client-only>
      </div>
    </div>
    <div v-else id="recoverPasswordForm" class="authentication">
      <section class="heading-bg flex flex--items-center justify--center">
        <h1 class="decorated-heading text--white">Reset your password</h1>
      </section>
      <div class="form-container mx-auto">
        <p>
          We will send you an email to reset your password.<br /><br />If you
          don't receive an email, please contact us at
          <a
            class="solvvy-support-flow-link"
            href="mailto:help@mylola.com?subject=Lola password recovery"
            style="cursor: pointer"
            >help@mylola.com</a
          ><a
            href="mailto:help@mylola.com?subject=Lola password recovery"
            class="solvvy-replaced-link"
            style="display: none"
            >help@mylola.com</a
          >
          and we will make sure it is sent.
        </p>
        <div v-if="userErrors.length" class="errors">
          <ul>
            <li v-for="(error, index) in userErrors" :key="index">
              {{ error.message }}
            </li>
          </ul>
        </div>
        <div v-if="failureMessage">
          <p class="errors" v-html="failureMessage"></p>
        </div>
        <div v-if="successMessage">
          <p class="success">{{ successMessage }}</p>
        </div>
        <client-only>
          <form method="post" @submit.prevent="reset">
            <label class="authentication__label">Email</label>
            <input
              v-model="recoverEmail"
              type="email"
              autocapitalize="off"
              class="input-alternate"
              spellcheck="false"
              autocomplete="off"
              required=""
              placeholder="Email"
            />
            <div class="grid">
              <input type="submit" value="Submit" class="button" />
              <button type="button" class="button" @click="toggleReset">
                Cancel
              </button>
            </div>
          </form></client-only
        >
      </div>
    </div>
    <section class="action-buttons text--center">
      <div class="form-container mx-auto">
        <h3>Get started</h3>
        <p>
          Activate your account to access your current subscription, or create
          an account if you’re new!
        </p>

        <div class="buttons grid">
          <nuxt-link
            to="/account/activate"
            class="button button--stripped text--no-decoration"
            >Activate account</nuxt-link
          >
          <nuxt-link
            to="/account/register"
            class="button button--stripped text--no-decoration"
          >
            Create account
          </nuxt-link>
        </div>
      </div>
    </section>
    <div class="lola-divider"></div>
    <div v-show="isSubmitted" class="cart__loader">
      <div class="lds-dual-ring"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      successMessage: '',
      failureMessage: '',
      recoverEmail: '',
      showPasswordReset: false,
      showLogin: false,
      showLoginFormLoader: true,
      isSubmitted: false
    }
  },
  computed: {
    ...mapState('account', ['userErrors', 'customer'])
  },
  mounted() {
    this.showLoginFormLoader = false
    this.showLogin = true
  },
  methods: {
    ...mapActions('account', ['login', 'recover']),
    ...mapMutations('account', ['setErrors']),
    submitForm() {
      const { email, password } = this.form
      this.isSubmitted = !this.isSubmitted
      this.setErrors([])

      this.login({ email, password })
        .then(() => {
          window._iaq.push(['account', this.$config.iterableApiKey])
          window._iaq.push(['identify', email, {}])
          this.isSubmitted = false
          this.form.email = ''
          this.form.password = ''
          // GA - dataLayer
          const customer = this.customer
          if (customer) {
            const shopifyCustomer = {
              id: customer.id,
              Name: customer.displayName,
              first_name: customer.firstName,
              last_name: customer.lastName,
              email: customer.email,
              phone: customer.phone,
              tags: customer.tags
            }
            window.dataLayer.push({
              customer: shopifyCustomer
            })
            window.ga('set', 'userId', shopifyCustomer.id)
          }

          this.$router.push({ path: '/account' })
        })
        .catch(() => {
          this.isSubmitted = !this.isSubmitted
        })
    },
    toggleReset() {
      this.showLogin = true
      this.showPasswordReset = !this.showPasswordReset
    },
    reset() {
      this.isSubmitted = true
      this.failureMessage = ''
      this.successMessage = ''
      this.recover({ email: this.recoverEmail })
        .then(() => {
          if (this.userErrors.length > 0) {
            this.scrollToTop()
            this.isSubmitted = false
          } else {
            this.isSubmitted = false
            this.successMessage =
              'We have sent you an email to reset your password'
            this.recoverEmail = ''
          }
        })
        .catch((e) => {
          this.isSubmitted = false
          this.successMessage = ''
          this.failureMessage = `An error occurred, please contact us at <a href="mailto:help@mylola.com?subject=Lola password recovery"
            style="cursor: pointer"
            >help@mylola.com</a>`
          this.recoverEmail = ''
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

@keyframes authentication-fade-in {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }

  50% {
    opacity: 0;
    transform: translateY(-1rem);
  }
}

.authentication-page {
  .form-container {
    width: 100%;
    max-width: 400px;

    .errors {
      background-color: #ffebee;
      padding: 4px;
    }

    .success {
      color: #fff;
      background-color: #8aac8a;
    }
  }
  .action-buttons {
    background-color: $light-terracotta;
    margin-top: 40px;
    padding: 60px 0;
  }

  #RecoverEmail {
    margin-bottom: 28px;
  }

  #customerLoginForm {
    margin-bottom: 40px;
  }

  @media screen and (max-width: 650px) {
    .form-container {
      padding: 0 20px;
    }
  }
}

.authentication {
  animation-duration: 600ms;
  animation-name: authentication-fade-in;
  animation-timing-function: ease-out;
  color: $action-color;
  min-height: 500px;
  text-align: center;

  .heading-bg {
    background: url(https://cdn.shopify.com/s/files/1/2568/9396/files/Hero_2x_705014c2-ae91-4a80-b949-f084f2bce6a1.jpg?v=1599225132)
      center center/cover no-repeat;
    height: 240px;
    margin-bottom: 60px;
  }

  @media screen and (max-width: 600px) {
    .heading-bg {
      background-image: url(https://cdn.shopify.com/s/files/1/2568/9396/files/Rectangle_3_2x_ce4f0d4f-0d5c-4383-bbc5-6f8a78ec83d2.jpg?v=1599225145);
      height: 200px;
      margin-bottom: 40px;
    }
  }

  &__heading {
    &::after {
      background-color: $light-blue;
      content: '';
      display: block;
      height: 4px;
      margin: 2rem auto;
      width: 5rem;
    }
  }
  &__label {
    margin-bottom: 1rem;
    margin-top: 1rem;
    text-align: left;
  }
  &__submit {
    display: block;
    margin-bottom: 1rem;
    margin-top: 2rem;
    width: 100%;
  }
  &__recover-password-link {
    color: $base-font-color;
    display: block;
  }
}

.grid {
  display: grid;
  grid-gap: 28px;
  grid-template-columns: repeat(2, 1fr);
}

.lola-divider {
  width: 100%;
  height: 0px;
  border-bottom: 1px solid #514945;
}
</style>
