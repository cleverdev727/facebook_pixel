<template>
  <form method="POST">
    <input
      id="signup-email-input"
      v-model="signUpEmailInput"
      :disabled="disabled"
      type="email"
      name="email"
      placeholder="name@email.com"
      required
    />
    <span class="placeholder flex flex--items-center">
      <button class="button">
        <span class="lds-dual-ring" style="display: none"></span>
        <span class="text">Enter</span>
      </button>
    </span>
  </form>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      signUpEmailInput: ''
    }
  },
  methods: {
    onSubmit() {
      console.log('submitted')
      this.$emit('submit', this.signUpEmailInput)
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin placeholder {
  font-size: 14px;
  color: #6e8db1;
  font-weight: 500;
}

form {
  width: 100%;
  position: relative;

  input {
    height: 48px;
    padding-left: 26px;
    padding-right: 60px;
    border-radius: 40px;
    border: 1px solid $dark-brown;

    &::placeholder {
      @include placeholder;
    }
  }

  .placeholder {
    font-size: 14px;
    position: absolute;
    top: 0;
    right: 24px;
    bottom: 0;

    button {
      border: none;
      background-color: transparent;
      color: inherit;

      &:hover {
        background-color: #5149451a;
      }
    }
  }
}
</style>
