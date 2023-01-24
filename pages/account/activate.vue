<template>
  <div class="authentication-acivate">
    <h1>Request account invite</h1>
    <p v-if="isActivate">
      Having trouble logging in to manage your existing subscription? You may
      need to activate the email address associated with your LOLA account.
    </p>
    <p v-if="!isActivate">
      An email will be sent to the email address provided if it is associated
      with your LOLA account. If you do not receive an email, you may have
      signed up for LOLA using a different email address. Reach out to us at
      help@mylola.com with the first name, last name, and shipping address
      associated with your account, and we'd be happy to assist!
    </p>
    <p v-if="!isActivate" class="try-again">
      <button id="try-again" @click="tryAgain">Try again</button>
    </p>
    <input v-if="isActivate" v-model="email" type="email" placeholder="Email" />
    <button v-if="isActivate" class="btn" @click="submit">submit</button>
    <nuxt-link to="/account/login">Return to login</nuxt-link>
    <div v-show="isSubmitted" class="cart__loader">
      <div class="lds-dual-ring"></div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      email: '',
      isActivate: true,
      isSubmitted: false
    }
  },
  methods: {
    ...mapActions('account', ['activate']),
    submit() {
      this.isSubmitted = true
      this.activate(this.email)
        .then((res) => {
          this.isSubmitted = false
          this.isActivate = false
          this.email = ''
        })
        .catch((err) => {
          this.isSubmitted = false
          this.isActivate = false
          this.email = ''
          console.error(err)
        })
    },
    tryAgain() {
      this.isActivate = true
    }
  }
}
</script>
<style lang="scss" scoped>
.authentication-acivate {
  margin: 4rem auto 6rem;
  max-width: 550px;
  padding-left: 28px;
  padding-right: 28px;
  .try-again {
    display: flex;
    justify-content: center;
  }
  #try-again {
    outline: none;
    background: none;
    color: #514945;
    text-decoration: underline;
    border: none;
  }
  .btn {
    margin: 0 auto;
  }
}
</style>
