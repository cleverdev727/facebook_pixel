import { stripHtmlSsr } from '../helpers/strings'

export default {
  head() {
    const meta = []
    const page = this.page
    if (this.page) {
      const globalTitle = this.$store.getters['space/getMetatag']('title')
      const titles = []
      const { title, description, excerpt, featuredMedia } = page
      const descriptionText = description || stripHtmlSsr(excerpt)

      if (title) {
        titles.push(title)
      }

      if (globalTitle) {
        titles.push(globalTitle.value)
      }

      const fullTitle = titles.join(' | ')

      meta.push({
        hid: 'og:title',
        property: 'og:title',
        content: fullTitle
      })

      if (descriptionText) {
        meta.push({
          hid: 'description',
          name: 'description',
          content: descriptionText
        })
        meta.push({
          hid: 'og:description',
          property: 'og:description',
          content: descriptionText
        })
      }

      if (featuredMedia) {
        meta.push({
          hid: 'og:image',
          property: 'og:image',
          content: featuredMedia.src
        })
      }

      /* Some pages include external scripts locally
       * (for example - the `Jobs` page). By introducing
       * a `localScripts` option in the page's vue instance,
       * we can check if it contains an array of scripts
       * and append them to the head section of the page
       * from within this mixin.
       */
      const localScripts = this.$options.localScripts || []

      const headObject = { title: fullTitle, meta }
      if (Array.isArray(localScripts) && localScripts.length) {
        headObject.script = [...localScripts]
      }

      return { ...headObject }
    }
  }
}
