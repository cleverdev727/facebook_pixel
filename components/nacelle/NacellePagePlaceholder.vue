<template>
  <div class="section">
    <div class="not-found">
      <h1 class="heading">404 Page Not Found</h1>
      <p>
        The page you requested does not exist. Click
        <nuxt-link to="/collections">here</nuxt-link> to continue&nbsp;shopping.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  min-height: 50vh;
  color: #514945;
  text-align: center;
  margin-top: 2em;

  .heading {
    text-align: center;
    margin-bottom: 0;
    line-height: 1.2;
  }

  p {
    font-size: 16px;
  }
}
</style>
