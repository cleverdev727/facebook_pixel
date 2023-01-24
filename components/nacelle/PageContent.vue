<template>
  <div class="page-content nacelle">
    <div v-if="page">
      <div v-for="section in page.sections" :key="section.id">
        <component
          :is="getComponentDefinition(section.sys.contentType.sys.id)"
          v-if="section.sys.contentType"
          :id="section.fields.handle"
          v-bind="section.fields"
          :type="section.sys.contentType.sys.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { pascalCase } from 'pascal-case'
import SideBySideContent from '@/components/lola/SideBySide'
import Slideshow from '@/components/lola/ContentSlideshow.vue'
import LolaHeroBanner from '@/components/lola/LolaHeroBanner.vue'
import Bestsellers from '@/components/lola/Bestsellers.vue'
import Advocacy from '~/components/nacelle/ContentAdvocacy'
import CategoryCards from '~/components/nacelle/ContentCategoryCards'
import CollectionGrid from '~/components/nacelle/CollectionGrid'
import CustomerReviews from '~/components/nacelle/ContentCustomerReviews'
import HeroBanner from '~/components/nacelle/ContentHeroBanner'
import HtmlSection from '~/components/lola/HTMLSection.vue'
import NacelleComponentPlaceholder from '~/components/nacelle/NacelleComponentPlaceholder'
import Points from '~/components/nacelle/ContentPoints'
import PressModule from '~/components/nacelle/ContentPressModule'
import ProductGrid from '~/components/nacelle/ContentProductGrid'

export default {
  components: {
    SideBySideContent,
    Advocacy,
    Bestsellers,
    CategoryCards,
    CollectionGrid,
    CustomerReviews,
    HeroBanner,
    LolaHeroBanner,
    HtmlSection,
    NacelleComponentPlaceholder,
    Points,
    PressModule,
    ProductGrid,
    Slideshow
  },
  props: {
    page: {
      type: Object,
      default: () => ({
        source: '',
        sections: []
      })
    }
  },
  methods: {
    getComponentDefinition(def) {
      if (this.$options.components[pascalCase(def)]) {
        return def
      } else {
        return 'NacelleComponentPlaceholder'
      }
    }
  }
}
</script>

<style></style>
