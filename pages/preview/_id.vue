<template>
  <div class="preview-container">
    <h2 class="text--center">Preview</h2>
    <hr />
    <component
      :is="getComponentDefinition(contentType)"
      v-if="content"
      :id="content.handle"
      v-bind="content"
      :type="contentType"
    />
  </div>
</template>

<script>
import { pascalCase } from 'pascal-case'
import { buildArticleData } from '@/helpers/blog'
import { buildBlogData } from '~/helpers/preview'

export default {
  data() {
    return {
      content: null,
      contentType: null
    }
  },
  async fetch() {
    const { $route, $preview } = this
    const { id } = $route.params
    const customComponentNames = {
      article: 'BlogArticle'
    }

    try {
      const { items } = await $preview.getEntries({
        'sys.id': id,
        limit: 1,
        include: 3
      })

      const entry = items[0]
      if (!entry) {
        console.warn('Resource with ID: ' + id + ' not found.')
        return
      }
      const contentType = entry.sys.contentType.sys.id
      this.contentType = customComponentNames[contentType] || contentType

      switch (this.contentType.toLowerCase()) {
        case 'blogarticle': {
          const article = buildArticleData(entry)
          this.content = { article }
          break
        }

        case 'blog': {
          const blog = await buildBlogData($preview, entry)
          this.content = { blog }
          break
        }

        default:
          this.content = entry
          break
      }
    } catch (error) {
      console.warn(error)
    }
  },
  methods: {
    getComponentDefinition(def = '') {
      if (this.$options.components[pascalCase(def)]) {
        return def
      } else {
        return 'NacelleComponentPlaceholder'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container {
  margin: 20px 0 60px;
}
</style>
