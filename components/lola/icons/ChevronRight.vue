<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="32"
    viewBox="0 0 24.5 32"
    :class="classz"
  >
    <path d="M0,32h8.5l13.9-13.9l2.1-2.1l-2.1-2.1L8.5,0H0l16,16L0,32z" />
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
