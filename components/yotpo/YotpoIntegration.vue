<template>
  <div
    v-show="!customerModified.id"
    id="swell-customer-identification"
    data-authenticated="true"
    :data-email="customerModified.email"
    :data-id="customerModified.id"
    :data-tags="customerModified.tags"
  ></div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('account', ['customer']),
    customerModified() {
      if (!this.customer) return {}
      const { id, tags } = this.customer
      const stringTags = JSON.stringify(tags)

      return { ...this.customer, id, tags: stringTags }
    }
  }
}
</script>
