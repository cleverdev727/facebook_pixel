export default {
  filters: {
    date(value, format) {
      if (!value) return ''
      const date = new Date(value)
      const monthAbb = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
      const year = date.getFullYear()
      const nMonth = date.getMonth()
      const month = monthAbb[nMonth]
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const amPm = date.getHours() < 12 ? 'AM' : 'PM'

      if (format === 'time') {
        return `${month} ${day}, ${year}  ${hour}:${minute}${amPm}`
      }
      if (format === 'short') {
        // e.g 8/2/2021
        return `${nMonth + 1}/${day}/${year}`
      }
      // e.g Aug 2, 2021
      return `${month} ${day}, ${year}`
    },
    dollarValue(value) {
      if (!value) return ''
      const dollarToFloat = parseFloat(value)
      const displayPrice =
        dollarToFloat % 1 === 0
          ? dollarToFloat.toFixed()
          : dollarToFloat.toFixed(2)
      return `$${displayPrice}`
    }
  }
}
