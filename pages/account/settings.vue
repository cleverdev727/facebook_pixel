<template>
  <section>
    <div class="account">
      <account-header />
      <section class="account__content">
        <customer-settings />
      </section>
    </div>
  </section>
</template>
<script>
export default {
  middleware: 'authenticated'
}
</script>
