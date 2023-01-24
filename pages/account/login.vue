<template>
  <login-form />
</template>

<script>
export default {
  middleware: 'notAuthenticated',
  asyncData({ store }) {
    store.commit('account/setErrors', [])
  }
}
</script>
