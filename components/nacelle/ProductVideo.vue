<template>
  <div class="product-video nacelle">
    <div v-if="showOverlay" class="overlay">
      <play-button />
    </div>
    <video
      ref="product-video"
      :src="source"
      :controls="showControls"
      :loop="loop"
      :muted="muted"
      :autoplay="autoplay"
      :playsinline="playsinline"
    />
  </div>
</template>

<script>
import PlayButton from '@/components/lola/icons/PlayButton.vue'

export default {
  components: { PlayButton },
  props: {
    source: {
      type: String,
      default: ''
    },
    showControls: {
      type: Boolean,
      default: true
    },
    showOverlay: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    muted() {
      if (this.autoplay === true) {
        return true
      } else {
        return false
      }
    },
    playsinline() {
      if (this.autoplay === true) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-video {
  position: relative;

  .overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #00000010;

    ::v-deep svg {
      opacity: 0.8;
    }
  }
}
</style>
