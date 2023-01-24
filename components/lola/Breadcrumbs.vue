<template>
  <div class="site-breadcrumbs">
    <template v-for="(crumb, index) in data">
      <span v-if="index < data.length - 1" :key="index" class="breadcrumb">
        <nuxt-link :to="crumb.link">{{ crumb.text }} /</nuxt-link>
      </span>
      <span
        v-else
        :key="index"
        :class="lastLinkIsClickable ? 'breadcrumb' : ''"
      >
        <nuxt-link v-if="lastLinkIsClickable" :to="crumb.link">{{
          crumb.text
        }}</nuxt-link>
        <span v-else>{{ crumb.text }}</span>
      </span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    lastLinkIsClickable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.site-breadcrumbs {
  margin-bottom: 10px;
  font-size: 12px;
  height: 18px;
  text-transform: capitalize;

  @media screen and (max-width: 768px) {
    padding: 15px 0;
  }

  .breadcrumb {
    margin-right: 5px;

    a {
      text-decoration: none;
    }
  }
}
</style>
