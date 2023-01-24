<template>
  <header class="account-header account__header">
    <h1 class="account-header__heading fw-md">My account</h1>
    <nav class="account-header__navigation">
      <ul class="account-header__list-items">
        <li class="account-header__list-item">
          <nuxt-link to="/account" class="account-header__link">
            Subscriptions
          </nuxt-link>
        </li>
        <li class="account-header__list-item">
          <nuxt-link to="/account/orders" class="account-header__link">
            Orders
          </nuxt-link>
        </li>
        <li class="account-header__list-item">
          <nuxt-link to="/account/settings" class="account-header__link">
            Settings
          </nuxt-link>
        </li>
        <li class="account-header__list-item">
          <a href="/account/my-rewards" class="account-header__link">Rewards</a>
        </li>
        <li class="account-header__list-item">
          <nuxt-link
            to="/"
            class="account-header__link account-header__logout"
            @click.native="handleLogout()"
          >
            Log out
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions('account', ['logout']),
    handleLogout() {
      // GA - dataLayer
      window.dataLayer = window.dataLayer.filter(
        (obj) => obj.customer === undefined
      )
      this.logout().then(() => {
        this.$router.push({ path: '/' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.account__header {
  @media (min-width: $account-width--desktop) {
    grid-column: 1 / 2;
  }
}

.account-header {
  padding: 1rem;
  grid-column: 1/3;

  @media (min-width: $account-width--desktop) {
    padding: 1em 2em;
    margin: 20px 0 20px 20px;
    border-bottom: 0;
    background-color: #f8f6f2;
    height: calc(100% - 40px);
  }
}

.account-header__heading {
  display: none;
  font-size: 28px;
  color: #514945;
  margin-bottom: 0.3em;

  @media (min-width: $account-width--desktop) {
    display: inherit;
  }
}

.account-header__link {
  color: $base-font-color;
  display: inline-block;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 2;
  text-decoration: none;
  padding: 0 1em;
  border-radius: 1.5em;

  &--active,
  &--hover {
    color: #fff !important;
    background: $action-color-strong;
  }

  @media (min-width: $account-width--desktop) {
    font-weight: normal;
  }
}

.account-header__navigation--active {
  @media (max-width: $account-width--desktop) {
    display: block;
  }
}

.account-header__list-items {
  display: flex;
  overflow: auto;
  white-space: nowrap;

  @media (min-width: $account-width--desktop) {
    display: block;
  }
}

.account-header__list-item {
  @media (min-width: $account-width--desktop) {
    margin-bottom: 1em;
  }
}

.account-header__logout {
  display: none;
  margin-top: 3em;

  @media (min-width: $account-width--desktop) {
    display: block;
  }
}
</style>
