<template>
  <div>
    <page-content class="page" :page="page" />
    <section class="questions-signups">
      <div class="container mx-auto">
        <div class="content">
          <section
            class="questions text--center flex flex--column justify--center"
          >
            <h2 class="text--bold">How can we help?</h2>
            <p>
              We’re here for the tampon questions, delivery troubleshooting, and
              anything else on your mind.
            </p>
            <div class="ctas flex justify--center mx-auto actions">
              <a
                href="https://help.mylola.com/contact/contact-us-HkTue1onH"
                class="button button--stripped button-md"
                >Ask our team</a
              >
              <a
                href="https://help.mylola.com/"
                class="button button--stripped button-md"
                >Explore FAQs</a
              >
            </div>
          </section>
          <div class="divider"></div>
          <section
            class="signup text--center flex flex--column justify--center"
          >
            <h2 class="text--bold">Sign up for 15% off</h2>
            <p>
              Get the latest updates and offers in your inbox, with 15% off your
              first subscription order.
              <a
                href="https://www.mylola.com/pages/disclaimer-first15"
                target="_blank"
                >Details</a
              >
            </p>
            <div class="actions justify--center">
              <form
                id="discount__form"
                method="POST"
                @submit.prevent="processSignUp"
              >
                <input
                  id="signup-email-input"
                  v-model="signUpEmailInput"
                  :disabled="disabled"
                  type="email"
                  name="email"
                  placeholder="name@email.com"
                  required
                />
                <span class="placeholder flex flex--items-center">
                  <button class="button">
                    <span class="lds-dual-ring" style="display: none"></span>
                    <span class="text">Enter</span>
                  </button>
                </span>
              </form>
              <span
                class="sub-success-message flex flex--items-baseline"
                style="display: none"
              >
                <span>You’re in! Use this code at checkout:</span>
                <h2 class="discount-code text--bold">FIRST15</h2>
              </span>
            </div>
          </section>
        </div>
      </div>
    </section>
    <nacelle-page-placeholder
      v-if="this.$fetchState.pending === false && page === null"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  scrollToTop: false,
  data() {
    return {
      page: null,
      disabled: false,
      signUpEmailInput: ''
    }
  },
  async fetch() {
    this.page = await this.$nacelle.data
      .page({
        handle: 'homepage'
      })
      .catch(() => {
        console.warn(
          `No page entry with handle 'homepage' found. Please create one in your CMS,`
        )
        return null
      })
  },
  mounted() {
    if (this.$route.query) {
      if ('cart' in this.$route.query) {
        setTimeout(() => {
          this.showCart()
        }, 3000)
      }
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    processSignUp() {
      const email = this.signUpEmailInput
      window._iaq.push(['identify', email, { email }])
      this.signUpEmailInput = ''
      this.disabled = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '/assets/scss/base/mixins/_containers.scss';
.questions-signups {
  background-color: #f8f6f2;
  padding: 36px 0 5px;

  @mixin placeholder {
    font-size: 14px;
    color: #6e8db1;
    font-weight: 500;
  }

  .content {
    margin: 0;
    display: flex;
    justify-content: space-around;
    padding-bottom: 40px;
    border-bottom: 1px solid $dark-brown;
  }

  section {
    width: 450px;
    max-width: 100%;

    h2 {
      margin-bottom: 14px;
    }
  }

  .ctas {
    max-width: 100%;

    .button {
      padding-top: 0;
      padding-bottom: 0;
      height: 40px;
      margin-right: 20px;
    }

    .button:last-child {
      margin-right: 0;
    }
  }

  .actions {
    padding-top: 20px;
  }

  .divider {
    width: 2px;
    background-color: $dark-brown;
  }

  .signup {
    form {
      width: 100%;
      position: relative;

      input {
        height: 48px;
        padding-left: 26px;
        padding-right: 60px;
        border-radius: 40px;
        border: 1px solid $dark-brown;

        &::placeholder {
          @include placeholder;
        }
      }

      .placeholder {
        font-size: 14px;
        position: absolute;
        top: 0;
        right: 24px;
        bottom: 0;

        button {
          border: none;
          background-color: transparent;
          color: inherit;

          &:hover {
            background-color: #5149451a;
          }
        }
      }
    }

    .actions {
      .lds-dual-ring {
        width: auto !important;
        height: auto !important;
      }

      .discount-code {
        padding-left: 10px;
        color: #6e8db1;
      }
    }
  }

  .questions,
  .signup {
    padding-left: 16px;
    padding-right: 16px;
  }

  .signup .actions .lds-dual-ring {
    width: auto !important;
    height: auto !important;
  }

  .signup .actions .lds-dual-ring:after {
    width: 24px;
    height: 24px;
    border-width: 3px;
  }

  #signup-email-input:focus {
    box-shadow: none;
  }

  @media screen and (max-width: $medium-screen) {
    .content {
      flex-direction: column;
      align-items: center;

      .questions {
        padding: 0 16px;

        p {
          font-size: 15px;
        }
      }

      .divider {
        width: 100%;
        height: 1.5px;
        margin: 65px 0;
      }

      .signup {
        padding: 0 16px;

        .sub-success-message {
          flex-direction: column;
          align-items: center;
        }
      }
    }

    .actions {
      justify-content: space-between;
    }
  }
}
</style>
