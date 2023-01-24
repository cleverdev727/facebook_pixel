<template>
  <div>
    <header class="cta-bar">
      <h1 class="cta-bar__heading">Jobs at LOLA</h1>
    </header>
    <div class="plain-content">
      <section class="plain-content__section">
        <div id="grnhse_app"></div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  head() {
    return {
      script: [
        {
          async: true,
          src: 'https://boards.greenhouse.io/embed/job_board/js?for=lola'
        }
      ],
      title: 'Jobs at LOLA',
      meta: [
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Find open jobs at mylola.com'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.cta-bar {
  padding-top: 2.9em;
  padding-bottom: 2.9em;
  color: #514945;
  font-size: 1.25rem;
  text-align: center;
  border-bottom: 1px solid #b8b8b8;

  h1 {
    font-size: 36px;
  }
}
.plain-content {
  min-height: 60vh;
  margin-left: auto;
  margin-right: auto;
  max-width: 70ch;
  padding: 0 28px 4rem;
}
</style>
