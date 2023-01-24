import Vue from 'vue'
import VCalendar from 'v-calendar'

Vue.use(VCalendar, {
  theme: {
    container: {
      light: 'vc-bg-white vc-rounded-lg'
    },
    weekdays: {
      light: 'vc-text-sm vc-font-bold'
    },
    dayContent: 'vc-font-medium vc-text-sm vc-cursor-pointer vc-rounded-full'
  }
})
