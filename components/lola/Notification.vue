<template>
  <div class="lola-notification" :class="{ show: notification.show }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notification: {
        show: false
      }
    }
  },
  methods: {
    hideNotification() {
      this.notification.show = false
    },
    showNotification(
      duration = 4000 /* 4 seconds to allow animations to run completely */
    ) {
      // Hide notification first in case there's a current one visible
      this.hideNotification()

      // Display new notification
      this.notification.show = true

      setTimeout(() => {
        // Hide after duration
        this.hideNotification()
      }, duration)
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes fade-in {
  from {
    transform: translateY(-100%);
  }

  50% {
    opacity: 0.5;
    transform: translateY(-1rem);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.lola-notification {
  position: fixed;
  top: 0;
  right: 0;
  width: 415px;
  max-width: calc(100vw - 32px);
  margin: 110px 20px 0 0;
  background-color: #fff;
  box-shadow: 0px 1px 18px 0px rgb(81 73 69 / 16%);
  padding: 18px;
  z-index: 600;
  opacity: 0;
  transform: translateY(-500px);

  @media screen and (max-width: $medium-screen) {
    margin: 100px auto 0 auto;
    right: auto;
  }

  &.show {
    animation: fade-in 0.5s ease-in forwards;
  }
}
</style>
