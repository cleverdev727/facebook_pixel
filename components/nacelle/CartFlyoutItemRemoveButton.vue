<template>
  <div>
    <span class="flyout-item-remove" @click="removeLineItem(lineId)">
      <icon-delete />
    </span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import IconDelete from '@/components/lola/icons/IconDelete.vue'

export default {
  components: {
    IconDelete
  },
  props: {
    lineId: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions('cart', ['removeLineItem'])
  }
}
</script>

<style lang="scss" scoped>
.flyout-item-remove {
  cursor: pointer;
  padding: 0 8px;
  margin-bottom: -2px;
}
</style>
