<template>
  <section class="accordion-container">
    <ul class="accordion-group">
      <li
        v-for="(accordion, index) in accordions"
        :key="index"
        class="accordion"
      >
        <div class="title">
          <span>
            {{ accordion.title }}
            <div class="toggle-icon">
              <span>—</span>
              <span class="switcher">—</span>
            </div>
          </span>
        </div>
        <ul class="body hide-children">
          <div>
            <div v-html="accordion.body || ''"></div>
            <product-certification-list :list="getCertList(accordion)" />
          </div>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
import AccordionGroup from '@/lib/accordion_group'
import ProductCertificationList from '@/components/lola/pdp/ProductCertificationList'

export default {
  components: { ProductCertificationList },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    accordions() {
      return this.product.metadata.accordions
    }
  },
  mounted() {
    const elements = document.querySelectorAll('ul.accordion-group')
    elements.forEach((element) => new AccordionGroup(element))
  },
  methods: {
    getCertList({ certificationIcons = [] }) {
      return certificationIcons.map((_icon) => {
        const { fields } = _icon
        const { icon } = fields
        if (icon) {
          return { ...fields, icon: icon.fields.file.url }
        }
        return fields
      })
    }
  }
}
</script>
