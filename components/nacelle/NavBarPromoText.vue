<template>
  <p class="nav-promo-text" v-html="content"></p>
</template>
<script>
import { BLOCKS } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
export default {
  data() {
    return {
      content: null
    }
  },
  async fetch() {
    const promoTextPage = await this.$nacelle.data.page({
      handle: 'navbar-promo-text'
    })

    if (promoTextPage) {
      const { content } = promoTextPage.sections[0].fields
      const options = {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (node, next) => next(node.content)
        }
      }
      this.content = documentToHtmlString(content, options)
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  font-size: inherit;
}
</style>
