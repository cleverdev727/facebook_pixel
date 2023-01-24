import { mapState, mapMutations } from 'vuex'
import { loadYotpoScript } from '../helpers/yotpo'

export default {
  computed: {
    ...mapState('space', ['domain']),
    ...mapState('account', ['customer']),
    isSandbox() {
      return this.domain.includes('mylola-sandbox')
    }
  },
  methods: {
    ...mapMutations('account', ['setCustomer']),
    loadYotpoScript() {
      loadYotpoScript(this.isSandbox)
    },
    savePoints() {
      // Keep a record of customer's yotpo points in the store
      const el = document.querySelectorAll('.yotpo-points-balance-text-part')
      if (el.length > 0) {
        const yotpoPoints = parseInt(el[1].innerHTML.trim())
        this.setCustomer({ ...this.customer, yotpoPoints })
      }
    }
  }
}
