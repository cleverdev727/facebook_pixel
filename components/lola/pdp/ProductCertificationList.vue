<template>
  <footer class="product-certifications">
    <ul class="certification-list">
      <li
        v-for="({ link, text, icon }, index) in list"
        :key="index"
        class="certification-list__item"
        :class="{ 'certification-list__item--text': !!text }"
      >
        <template v-if="text">
          <span>{{ text }}</span>
        </template>
        <template v-else>
          <a v-if="link" :href="link" target="_blank">
            <nuxt-img
              class="certification-list__icon"
              :src="sanitizeImageUrl(icon)"
              alt=""
            />
          </a>
          <nuxt-img
            v-else
            class="certification-list__icon"
            :src="sanitizeImageUrl(icon)"
            alt=""
          />
        </template>
      </li>
    </ul>
  </footer>
</template>

<script>
import commonMixins from '~/mixins/commonMixins'
export default {
  mixins: [commonMixins],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    isTextList(tag) {
      return [
        'Certified Organic by ICEA GOTS 2016-027',
        'FDA 510(k) cleared'
      ].includes(tag)
    }
  }
}
</script>
