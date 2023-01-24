<template>
  <div class="product-reviews">
    <p class="product-reviews__disclaimer">
      These verified reviews are from people who purchased a LOLA product
    </p>
    <div class="product-reviews__header">
      <p class="product-reviews__header-item">Reviews</p>
      <nuxt-link class="button product-reviews__cta" to="/collections"
        >Shop all</nuxt-link
      >
    </div>
    <testimonials-widget />
  </div>
</template>

<style lang="scss" scoped>
.product-reviews__disclaimer {
  margin: auto;
  padding: 0.5em 2em;
  font-size: 14px;
  text-align: center;
  background-color: #4e6282;
  color: #fff;
}

.product-reviews__header {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  padding: 0 2em;
  padding-top: 1em;
  margin: 0 10px;

  @media (min-width: 600px) {
    flex-flow: row;
  }
}

.product-reviews__header-item {
  margin: auto 0;
  font-size: 40px;

  @media (min-width: 600px) {
    font-size: 56px;
  }
}

.product-reviews__cta {
  height: 36px;
  padding: 0 5em;
  background: none;
  border: 1px solid #514945;
  color: #514945;
  width: 100%;

  &:hover {
    background: #4e6282;
    color: #fff;
  }

  @media (min-width: 600px) {
    width: auto;
  }
}

.testimonials {
  display: block !important;
  padding: 0 2em !important;

  @media (min-width: 600px) {
    padding: 0 10em !important;
  }
}

/*! purgecss start ignore */
.yotpo .yotpo-nav {
  display: none !important;
}

#yotpo-testimonials-custom-tab {
  width: 80vw;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 0;
}

#yotpo-testimonials-custom-tab .yotpo-modal-bottom-line {
  border-top: none !important;
}

#yotpo-testimonials .yotpo-popup-box-medium .yotpo-hidden {
  display: none !important;
}

#yotpo-testimonials-custom-tab .yotpo-label {
  display: none !important;
}

.yotpo .yotpo-review .yotpo-footer .yotpo-helpful,
.yotpo .yotpo-comment .yotpo-footer .yotpo-helpful,
.yotpo .yotpo-question .yotpo-footer .yotpo-helpful,
.yotpo .yotpo-onsite-upload .yotpo-footer .yotpo-helpful {
  float: right !important;
}

#yotpo-testimonials .yotpo-footer .yotpo-helpful .label-helpful {
  display: none !important;
}

#yotpo-testimonials
  .yotpo-modal-dialog
  .yotpo-modal-content
  #yotpo-testimonials-product-bottomline {
  .yotpo-icon-star,
  .yotpo-icon-half-star,
  .yotpo-icon-empty-star {
    font-size: 18px !important;
    color: #4e6282 !important;
  }
}

#yotpo-testimonials .text-m {
  color: #514945 !important;
}
/*! purgecss end ignore */
</style>
