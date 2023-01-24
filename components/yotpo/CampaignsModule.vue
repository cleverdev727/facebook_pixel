<template>
  <div class="yotpo-campaigns-module">
    <div
      v-if="isSandbox"
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8801"
    ></div>
    <div
      v-else
      class="yotpo-widget-instance"
      data-yotpo-instance-id="8817"
    ></div>
  </div>
</template>

<script>
import yotpo from '@/mixins/yotpo'
export default {
  mixins: [yotpo],
  mounted() {
    this.loadYotpoScript()

    document.addEventListener('click', (e) => {
      const element = e.target
      if (
        element.classList.contains('yotpo-widget-campaign-widget-close-button')
      ) {
        const parent = element?.parentElement?.parentElement?.parentElement
        parent.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            code: 'Escape',
            isTrusted: true,
            cancelBubble: false
          })
        )
      }
    })
  }
}
</script>
