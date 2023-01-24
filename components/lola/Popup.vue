<template>
  <modal-overlay
    ref="overlay"
    :show="showOverlay"
    @click.native.self="$emit('modal-clicked')"
  >
    <div class="pop-up--box">
      <header :class="{ ['is-floating']: fillBox }">
        <div class="close-icon" @click="closePopup">
          <close-icon />
        </div>
      </header>
      <div class="body">
        <slot></slot>
      </div>
    </div>
  </modal-overlay>
</template>

<script>
import CloseIcon from './icons/CloseIcon'
import ModalOverlay from './ModalOverlay'
export default {
  components: {
    CloseIcon,
    ModalOverlay
  },
  props: {
    fillBox: {
      type: Boolean,
      default: () => false
    },
    maxWidth: {
      type: String,
      default: 'auto'
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      showOverlay: false,
      overflowValue: ''
    }
  },
  watch: {
    show: {
      immediate: false,
      handler(show) {
        if (show === false) {
          this.hidePopup()
        } else {
          this.showPopup()
        }
      }
    }
  },
  mounted() {
    this.overflowValue = document.body.parentElement.style.overflowY

    if (this.show) {
      this.showPopup()
    }
  },
  methods: {
    closePopup() {
      this.$emit('close-popup')
    },
    hidePopup() {
      document.body.parentElement.style.overflowY = this.overflowValue
      this.$refs.overlay.$el.style.opacity = 0
      setTimeout(() => {
        this.showOverlay = false
      }, 250)
    },
    showPopup() {
      this.showOverlay = true
      setTimeout(() => {
        this.$refs.overlay.$el.style.opacity = 1
      }, 10)
      document.body.parentElement.style.overflowY = 'hidden'
    }
  }
}
</script>

<style lang="scss" scoped>
/*! purgecss start ignore */
.pop-up {
  &--box {
    position: relative;
    min-width: 150px;
    min-height: 150px;
    max-height: 90vh;
    background-color: #fff;
    box-shadow: 0px 3px 6px #00000033;
    border-radius: 5px;
    overflow-y: auto;

    header {
      display: flex;
      justify-content: flex-end;
      padding: 10px;

      &.is-floating {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
      }

      .close-icon {
        cursor: pointer;
      }
    }

    &.hidden {
      visibility: hidden;
      opacity: 0;
    }

    ::v-deep .content-popup-img {
      max-height: 80vh;
    }
  }

  @media screen and (max-width: 768px) {
    &--box {
      margin: 0 15px;
    }
  }

  @media screen and (max-width: $medium-screen) {
    &--box {
      margin: 0 auto;
      width: calc(100% - 30px);
    }
  }
}
/*! purgecss end ignore */
</style>
