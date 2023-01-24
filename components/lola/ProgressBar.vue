<template>
  <div
    class="progress"
    role="progress"
    :aria-valuemax="maxValue"
    :aria-valuemin="minValue"
  >
    <div class="progress-bar" :style="{ width }"></div>
  </div>
</template>

<script>
export default {
  props: {
    maxValue: {
      type: Number,
      default: 100
    },
    minValue: {
      type: Number,
      default: 0
    },
    value: {
      type: Number,
      required: true
    }
  },
  computed: {
    width() {
      return `${this.value}%`
    }
  }
}
</script>

<style lang="scss" scoped>
.progress {
  width: 100%;
  height: 10px;
  background-color: #dcdcdc;
  border-radius: 38px;
  overflow-x: hidden;

  &-bar {
    background: $dark-blue;
    height: 100%;
    width: 0%;
    transition: width 0.2s cubic-bezier(0, 0.56, 0.28, 1.04) 0s;
  }
}
</style>
