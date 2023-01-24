<template>
  <client-only>
    <notification ref="accountNotif">
      <div class="flex flex--items-center">
        <icon-cancel v-if="accountNotification.type === 'error'" class="mr-3" />
        <blue-checkmark v-else class="mr-3" />
        <div
          v-if="accountNotification.type === 'error'"
          class="flex flex--column"
        >
          <h4 class="fw-md">Oops! Something went wrong.</h4>
          <small>{{ accountNotification.message }}</small>
        </div>
        <div v-else class="flex flex--column">
          <h4 class="fw-md">Success</h4>
          <small>{{ accountNotification.message }}</small>
        </div>
      </div>
    </notification>
  </client-only>
</template>

<script>
import { mapState } from 'vuex'
import BlueCheckmark from '@/components/lola/icons/BlueCheckmark'
import IconCancel from '@/components/lola/icons/IconCancel'
import Notification from '@/components/lola/Notification'

export default {
  components: {
    BlueCheckmark,
    IconCancel,
    Notification
  },
  computed: {
    ...mapState('account', ['accountNotification'])
  },
  watch: {
    accountNotification: {
      handler(notification) {
        const duration = notification.type === 'error' ? 6000 : 3000
        this.$refs?.accountNotif?.showNotification(duration)
      }
    }
  }
}
</script>
