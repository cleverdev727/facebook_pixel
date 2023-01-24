<template>
  <div class="free-shipping-counter nacelle">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.free-shipping-counter {
  color: $dark-blue;
  text-align: center;
  font-size: 14px;
  line-height: 22px;
}

.free-shipping {
  font-weight: bold;
}
</style>
