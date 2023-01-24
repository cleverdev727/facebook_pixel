<template>
  <span role="button"><new-icon-chevron /></span>
</template>
<script>
import NewIconChevron from './NewIconChevron'

export default {
  components: { NewIconChevron },
  props: {
    classz: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  cursor: pointer;
}
svg {
  width: 10px;
  height: 10px;
  padding: 4px;
  box-sizing: content-box;
  border: 1px solid $dark-brown;
  border-radius: 50%;
}
</style>
