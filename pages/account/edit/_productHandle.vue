<template>
  <section>
    <div class="subscription-item__back-navigation">
      <p>
        <nuxt-link to="/account" class="subscription-item__navigation-link">
          ◀&nbsp; Back to My Subscriptions
        </nuxt-link>
      </p>
    </div>
    <product :subscription="currentSubscription" />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import product from '@/pages/products/_productHandle.vue'

export default {
  components: {
    product
  },
  middleware: 'authenticated',
  computed: {
    ...mapState('account', ['subscriptions']),
    currentSubscription() {
      const id = parseInt(this.$route.query.sub_id)
      return this.subscriptions.find((sub) => sub.id === id) || {}
    }
  }
}
</script>

<style lang="scss" scoped>
.subscription-item__back-navigation {
  padding: 8px;
  margin-left: calc(((100vw - 100%) / 2) * -1);
  padding-left: calc((100vw - 100%) / 2);
  margin-right: calc((100vw - 100%) / 2 * -1);
  padding-right: calc((100vw - 100%) / 2);
  margin-bottom: 10px;
  background-color: #4e6282;
}

.subscription-item__back-navigation > p {
  margin: 0 auto;
  color: #fff;

  a:hover {
    color: #e2e2e2;
  }

  @media (max-width: 1024px) {
    width: 95vw;
  }
}

.subscription-item__navigation-link {
  font-weight: 600;
  text-decoration: none;
  color: #fff;
}
</style>
