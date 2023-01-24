<template>
  <notification ref="notif">
    <div class="flex flex--items-center">
      <blue-checkmark class="bcm" />
      <div class="flex flex--column">
        <h4 class="fw-md text--blue product-title">{{ title }}</h4>
        <small>has been added to your bag</small>
      </div>
      <button class="button text--light" @click="handleClick">Checkout</button>
    </div>
  </notification>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import BlueCheckmark from '@/components/lola/icons/BlueCheckmark.vue'
import Notification from '../lola/Notification.vue'
export default {
  components: { BlueCheckmark, Notification },
  data() {
    return {
      title: ''
    }
  },
  computed: {
    ...mapState('global', ['cartNotification'])
  },
  watch: {
    cartNotification: {
      immediate: true,
      handler({ show, title }) {
        if (show === true) {
          this.showNotification(title)
          // Reset
          this.hideCartNotification()
        }
      }
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapMutations('global', ['hideCartNotification']),
    handleClick() {
      setTimeout(() => {
        this.showCart()
      }, 0)
      this.$refs.notif.hideNotification()
    },
    showNotification(title = '') {
      this.title = title
      this.$refs.notif.showNotification()
    }
  }
}
</script>

<style lang="scss" scoped>
.bcm {
  margin-right: 12px;
}

.product-title {
  margin-right: 16px;
}

button {
  margin-left: auto;
}

small {
  font-size: 12px;
  color: $light-brown;
}

@media screen and (max-width: $medium-screen) {
  button {
    font-size: 13px;
    padding-left: 8px;
    padding-right: 8px;
    height: 32px;
  }
}
</style>
