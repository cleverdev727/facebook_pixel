<template>
  <div class="quantity-updater" :class="{ 'disable-touch': disabled }">
    <span
      class="switch"
      @mousedown="start(decrement)"
      @touchstart.prevent="start(decrement)"
      @touchend.prevent="stop"
    >
      <span>-</span>
    </span>
    <span class="quantity-updater__counter">{{ quantity }}</span>
    <span
      class="switch"
      :class="{ disabled: quantity >= 6 }"
      @mousedown="start(increment)"
      @touchstart.prevent="start(increment)"
      @touchend.prevent="stop"
    >
      <span>+</span>
    </span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
const timeInterval = 100

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({})
    },
    quantity: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data: () => {
    return {
      interval: null,
      startTime: null,
      handler: Function
    }
  },
  methods: {
    ...mapActions('cart', ['incrementLineItem', 'decrementLineItem']),
    /**
     *  Allows us to await a setTimeout by return a Promise
     * @param milliseconds - ms argument for setTimeout
     */
    wait(milliseconds) {
      return new Promise((resolve, reject) => setTimeout(resolve, milliseconds))
    },
    /**
     *  Emits quantity update for sync modifier on parent.
     * @param quantity - new quantity value
     */
    update(quantity) {
      this.$emit('update:quantity', quantity)
    },
    /**
     *  Increase quantity. Type coersion prevents string concatenation.
     */
    increment() {
      if (this.item) {
        this.incrementLineItem(this.item.id)
        return
      }

      if (Number(this.quantity) === 6) return

      const newQuantity = Number(this.quantity) + 1
      this.update(newQuantity)
      this.$emit('change', newQuantity)
    },
    /**
     *  Decrease quantity. Prevents negative number.
     */
    decrement() {
      if (this.quantity > 0) {
        if (this.item) {
          this.decrementLineItem(this.item.id)
        } else {
          this.update(this.quantity - 1)
        }

        this.$emit('change', Math.max(this.quantity - 1, 0))
      }
    },
    /**
     *  Start a repetitive call to increment and decrement method after a timeInterval on mousedown event and will stop on mouseup event on controls
     * @param handler - increment or decrement method
     */
    async start(handler) {
      document.addEventListener('mouseup', this.stop)
      this.startTime = new Date()
      this.handler = handler
      await this.wait(500)
      clearInterval(this.interval)
      if (this.startTime) {
        this.interval = setInterval(handler, timeInterval)
      }
    },
    /**
     * clear interval on mouseup event and remove the listener
     * @param evt - event to be removed
     */
    stop(evt) {
      document.removeEventListener(evt.type, this.stop)
      this.handler()
      clearInterval(this.interval)
      this.interval = null
      this.handler = null
      this.startTime = null
    }
  }
}
</script>

<style lang="scss" scoped>
.quantity-updater {
  display: flex;
  .quantity-updater__counter {
    padding: 0 10px;
  }
  .switch {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 1px solid #514945;
    display: flex;
    text-align: center;
    cursor: pointer;
    align-items: center;
    justify-content: center;

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    @media screen and (max-width: $medium-screen) {
      height: 15px;
      width: 15px;
    }
  }

  @media screen and (max-width: $medium-screen) {
    align-items: center;
    .quantity-updater__counter {
      padding: 0 5px;
    }
  }
}
</style>
