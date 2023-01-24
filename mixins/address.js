export default {
  filters: {
    address(value) {
      if (!value) return ''
      const {
        first_name: firstName,
        last_name: lastName,
        address1: address,
        city,
        zip,
        country
      } = value

      return `<p>${firstName} ${lastName}<br />${address}<br />${city} ${zip}<br />${country}</p>`
    }
  }
}
