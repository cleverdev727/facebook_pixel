<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :class="classz">
    <path
      d="M0 .75v8.5l13.875 13.875 2.125 2.125 2.125-2.125
      13.875-13.875v-8.5l-16 16-16-16z"
      transform="translate(0 1)"
    />
  </svg>
</template>
<script>
export default {
  props: {
    classz: {
      type: String,
      default: ''
    }
  }
}
</script>
