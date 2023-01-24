<template>
  <client-only>
    <section class="order__content">
      <section>
        <div class="order__content-heading">
          <button @click="downloadInvoice">Download invoice</button>
        </div>
      </section>
      <section :ref="'invoice-' + order.id">
        <nuxt-img
          v-show="showLogo"
          src="/lola-logo.svg"
          alt="LOLA"
          class="invoice-header"
        />
        <p v-if="order.cancelled">{{ order.cancelled_at }}</p>
        <p v-if="order.cancelled">{{ order.cancel_reason }}</p>
        <section>
          <table class="order__content-table">
            <thead>
              <tr>
                <th colspan="2">{{ order.created_at | date('time') }}</th>
                <th>Unit price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="line_item in order.line_items" :key="line_item.key">
                <td v-if="line_item.images.original">
                  <nuxt-img :src="line_item.images.original" />
                </td>
                <td>
                  <div class="order__content-title">
                    {{ lineItemTitle(line_item) }}
                  </div>
                </td>
                <td>${{ line_item.price }}</td>
                <td>{{ line_item.quantity }}</td>
                <td>${{ line_item.quantity * line_item.price }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"></td>
                <td colspan="2">
                  <strong> Subtotal </strong>
                </td>
                <td>${{ order.subtotal_price }}</td>
              </tr>

              <tr v-for="discount in order.discount_codes" :key="discount.code">
                <td colspan="2"></td>
                <td colspan="2">
                  <strong>{{ discount.code }}</strong>
                </td>
                <td>${{ discount.amount }}</td>
              </tr>

              <tr v-for="shipping in order.shipping_lines" :key="shipping.code">
                <td colspan="2"></td>
                <td colspan="2">
                  <strong>{{ shipping.title }}</strong>
                </td>
                <td>${{ shipping.price }}</td>
              </tr>

              <tr>
                <td colspan="2"></td>
                <td colspan="2">
                  <strong> Tax </strong>
                </td>
                <td>${{ order.total_tax }}</td>
              </tr>
              <tr>
                <td colspan="2"></td>
                <td colspan="2">
                  <strong> Total </strong>
                </td>
                <td>${{ order.total_price }} {{ order.currency }}</td>
              </tr>
            </tfoot>
          </table>
          <ul>
            <li>
              <h3>Billing address</h3>
              <p v-html="$options.filters.address(order.billing_address)"></p>
            </li>
            <li>
              <h3>Shipping address</h3>
              <p v-if="order.fulfillment_status_label">
                Fulfillment status: {{ order.fulfillment_status_label }}
              </p>
              <p v-html="$options.filters.address(order.shipping_address)"></p>
            </li>
          </ul>
        </section>
      </section>
    </section>
  </client-only>
</template>

<script>
import datePriceFilters from '@/mixins/datePriceFilters.js'
import address from '@/mixins/address.js'

export default {
  mixins: [datePriceFilters, address],
  props: {
    order: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showLogo: false
    }
  },
  methods: {
    toggleLogo() {
      this.showLogo = !this.showLogo
    },
    lineItemTitle(item) {
      return item.sku.includes('TSET')
        ? item.title.replace('(Ships every 4 weeks)', '')
        : item.title
    },
    async downloadInvoice() {
      await this.toggleLogo()
      const name = `Order #${this.order.id}__invoice.pdf`
      const ele = this.$refs['invoice-' + this.order.id]
      const { jsPDF } = window.jspdf
      const { html2canvas } = window
      const canvas = await html2canvas(ele)
      const imgData = canvas.toDataURL('image/png')
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', [800, 840])
      await doc.addImage(imgData, 'PNG', 40, 40)
      await doc.save(name)
      this.toggleLogo()
    }
  }
}
</script>

<style lang="scss" scoped>
.order__content {
  margin: 0 24px;

  &-heading {
    display: flex;
    justify-content: flex-end;
    margin-top: 1em;
    font-weight: bold;

    button {
      font-size: 12px;
      height: 24px;
    }
  }

  &-table {
    display: block;
    overflow-x: scroll;
  }

  &-title {
    @media (min-width: 600px) {
      max-width: 75%;
    }
  }

  .invoice-header {
    font-size: 30px;
  }
}
</style>
