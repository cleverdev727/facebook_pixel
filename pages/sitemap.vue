<template>
  <div id="sitemap">
    <h1>Sitemap</h1>
    <div class="container">
      <div>
        <h2>Shop by category</h2>
        <section v-for="(handle, index) in handles" :key="index">
          <h3>{{ handle.name }}</h3>
          <p v-for="(product, ind) in handle.products" :key="ind">
            <nuxt-link :to="'/products/' + product.handle">
              {{ product.title }}
            </nuxt-link>
          </p>
        </section>
      </div>
      <div>
        <h2>Other information</h2>
        <section v-for="(page, index) in pages" :key="index">
          <h3>{{ page.name }}</h3>
          <p v-for="(url, ind) in page.urls" :key="ind">
            <a
              :href="url.link"
              :target="url.link.startsWith('/') ? '' : '_blank'"
            >
              {{ url.title }}
            </a>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      handles: [
        {
          name: 'Periods',
          products: [
            {
              handle: 'cardboard-applicator-tampons',
              title: 'Cardboard Applicator Tampons'
            },
            { handle: 'liners', title: 'Ultra Thin Liners' },
            { handle: 'pads', title: 'Pads with Wings' },
            { handle: 'menstrual-cup', title: 'Menstrual Cup' },
            {
              handle: 'non-applicator-tampons',
              title: 'Non-applicator Tampons'
            },
            {
              handle: 'applicator-tampons',
              title: 'Compact Plastic Applicator Tampons'
            },
            { handle: 'heating-patch', title: 'Heating Patch' },
            { handle: 'essential-oil-blend', title: 'Essential Oil Blend' },
            { handle: 'daily-supplement', title: 'Daily Multivitamin' },
            { handle: 'cleansing-wipes-pouch', title: 'Cleansing Wipes Pouch' },
            { handle: 'cleansing-wipes', title: 'Cleansing Wipes Packets' },
            { handle: 'first-period-kit', title: 'First Period Kit' }
          ]
        },
        {
          name: 'Cramps',
          products: [
            { handle: 'essential-oil-blend', title: 'Essential Oil Blend' },
            { handle: 'daily-supplement', title: 'Daily Multivitamin' },
            { handle: 'heating-patch', title: 'Heating Patch' }
          ]
        },
        {
          name: 'Sex',
          products: [
            { handle: 'personal-lubricant', title: ' Personal Lubricant' },
            { handle: 'mini-vibrator', title: 'Mini Vibrator' },
            { handle: 'condoms', title: 'Ultra Thin Latex Condoms' },
            { handle: 'sexual-wellness-kit', title: 'Sexual Wellness Kit' }
          ]
        }
      ],

      pages: [
        {
          name: 'About',
          urls: [
            { link: '/about', title: 'Our story' },
            { link: 'https://retail.mylola.com/', title: 'Find in stores' },
            { link: '/jobs', title: 'Careers' },
            { link: 'http://business.mylola.com/', title: 'Wholesale' },
            { link: 'https://blog.mylola.com/', title: 'The Spot by LOLA' }
          ]
        },
        {
          name: 'Support',
          urls: [
            {
              link: 'https://help.mylola.com/contact/contact-us-HkTue1onH',
              title: 'Contact us'
            },
            { link: 'https://help.mylola.com/', title: 'FAQs' },
            { link: 'mailto:press@mylola.com', title: 'Press Inquiries' }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#sitemap {
  max-width: 1024px;
  margin: 0 auto;
  h1 {
    @media (max-width: $medium-screen) {
      margin-left: 32px;
    }
  }
  .container {
    @media (min-width: $medium-screen) {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: $medium-screen) {
      margin-left: 32px;
    }
    div {
      margin: 0;
      h2 {
        color: $dark-blue;
        font-size: 29px;
        margin: 0 0 1rem 0;
      }
      section {
        margin: 0 0 2rem 0;
        h3 {
          font-size: 23px;
          color: $medium-gray;
          margin: 0;
        }
        p {
          margin: 0;
          a {
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>
