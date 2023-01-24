export default class AccordionGroup {
  constructor(element) {
    this.accordionGroup = element
    this._singleActiveAccordion = true
    this.accordions = this.getAccordions()

    setTimeout(() => {
      this.run()
    }, 0)
  }

  collapseAccordion(accordion) {
    accordion.element.classList.remove('expanded')
    accordion.active = false
    setTimeout(() => {
      this.hideChildren(accordion.element)
    }, 400)
  }

  expandAccordion(accordion) {
    this.showChildren(accordion.element)
    accordion.element.classList.add('expanded')
    accordion.active = true
  }

  getAccordions() {
    const accordions = this.accordionGroup.querySelectorAll('.accordion')
    const list = []

    accordions.forEach((accordion, index) => {
      list.push({
        active: false,
        element: accordion,
        index
      })
    })

    return list
  }

  hideChildren(element) {
    const body = element.querySelector('ul.body')
    body.classList.add('hide-children')
  }

  showChildren(element) {
    const body = element.querySelector('ul.body')
    body.classList.remove('hide-children')
  }

  singleActiveAccordion(bool) {
    this._singleActiveAccordion = bool
  }

  run() {
    this.accordions.forEach((accordion) => {
      const { active, element, index } = accordion
      if (active) {
        element.classList.add('expanded')
      } else {
        this.hideChildren(element)
      }

      const title = element.querySelector('.title')

      title.onclick = (e) => {
        if (this._singleActiveAccordion) {
          this.accordions.forEach((accordion, _index) => {
            if (index === _index) {
              if (
                accordion.active ||
                accordion.element.classList.contains('expanded')
              ) {
                return this.collapseAccordion(accordion)
              }
              return this.expandAccordion(accordion)
            } else {
              this.collapseAccordion(accordion)
            }
          })
        } else {
          if (active) {
            return this.collapseAccordion(accordion)
          }
          return this.expandAccordion(accordion)
        }
      }
    })
  }
}
