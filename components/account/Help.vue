<template>
  <client-only>
    <div class="subscription-help">
      <div>
        <span class="subscription-help-desc">
          Need help? Our Customer Team is available via email for anything you
          need.
        </span>
        <a
          class="subscription-help-cta"
          href="https://help.mylola.com/"
          target="_blank"
          >Ask our team</a
        >
      </div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped>
.subscription-help {
  box-shadow: 0 3px 6px #0000001a;
  margin: 0 1.2em;
  margin-bottom: 3em;
  padding: 1em;
  background-color: #f8f6f2;

  &-desc {
    display: block;
    text-align: left;
    font-size: 14px;
    margin-right: 1em;

    @media (min-width: $medium-screen) {
      font-size: 18px;
    }
  }

  &-cta {
    display: block;
    border: 1px solid;
    text-decoration: none;
    text-align: center;
    border-radius: 1.5em;
    margin: 1em 0;
    padding: 0.5em 0;

    @media (min-width: $medium-screen) {
      font-size: 18px;
      margin: 1.6em;
      margin-bottom: 0;
      padding: 0.6em 0;
    }
  }

  div {
    padding: 1em;
    max-width: 28em;
  }

  @media (min-width: $medium-screen) {
    grid-column: 1 / 3;
    display: flex;
    justify-content: center;

    &-desc,
    &-cta {
      text-align: center;
    }
  }
}
</style>
