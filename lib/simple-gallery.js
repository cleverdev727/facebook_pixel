class SimpleGallery {
  constructor(container) {
    this.container = container
    // Set default values
    this._showDots = false
    this._interval = 5000
    this.currentIndex = 0
    this.autoSlide = true
    this.entries = this.container.querySelectorAll('.section__entry')
    if (this.entries.length > 1) {
      setTimeout(() => {
        this.init()
      }, 0)
    }
  }

  addQuotesToEntry(entry) {
    const text = entry.textContent
    const ratingsRegex = /\[stars:\s*\d{1}\]$/
    const regexResult = text.match(ratingsRegex)
    if (!regexResult) {
      return
    }

    const match = regexResult[0]
    let innerHtml = entry.innerHTML.replace(match, '')
    // We are looking to extract the number of stars from this format [stars: 7]
    const numberOfStars = match
      .replace('[', '')
      .replace(']', '')
      .split(':')[1]
      .trim()

    const icon = `
        <svg xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 512 512">
          <path d = "M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z" />
        </svg>
      `

    const stars = Array.from(Array(parseInt(numberOfStars)))
      .map(() => icon)
      .join('')

    const ratingsDiv = `<div class="ratings">
                            ${stars}
                          </div>
                        `

    entry.innerHTML = innerHtml += ratingsDiv
  }

  autoRun(bool) {
    this.autoSlide = bool
    return this
  }

  getEntryMaxSize() {
    return `${100 / this.entries.length}%`
  }

  highlightDot(currentIndex, direction = 'right') {
    let newIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1
    if (newIndex >= this.entries.length) {
      newIndex = 0
    }

    if (newIndex < 0) {
      newIndex = this.entries.length - 1
    }

    const dots = this.container.parentElement.querySelectorAll('.dots .dot')
    dots.forEach((dot, index) => {
      index === newIndex
        ? dot.classList.add('active')
        : dot.classList.remove('active')
    })

    this.currentIndex = newIndex
    return this
  }

  init() {
    if (this._showDots) {
      addDotsToSlider(this)
    }
    this.container.style.width = `${this.entries.length * 100}%`
    this.entries.forEach((entry) => {
      entry.style.maxWidth = this.getEntryMaxSize()
      this.addQuotesToEntry(entry)
    })

    if (this.autoSlide) {
      setInterval(() => {
        this.move()
      }, this._interval)
    }

    return this
  }

  next() {
    this.move('right')
    return this
  }

  prev() {
    this.move('left')
    return this
  }

  setInterval(interval) {
    this._interval = interval
    return this
  }

  showDots(bool = true) {
    this._showDots = bool
    return this
  }

  move(direction = 'right') {
    const sectionEntries = this.container.querySelectorAll('.section__entry')
    const length = sectionEntries.length
    const firstItem = sectionEntries[0]
    const lastItem = sectionEntries[length - 1]
    const activeEntry = this.container.querySelector(
      '.section__entry.active-entry'
    )
    const leftMarginPercentage = '-' + this.getEntryMaxSize() // Negative value needed

    if (direction === 'right') {
      firstItem.style.marginLeft = leftMarginPercentage
      const timeout = Math.min(this._interval, 400)
      setTimeout(() => {
        this.container.removeChild(firstItem)
        firstItem.classList.remove('active-entry')
        firstItem.style.marginLeft = 0
        this.container.appendChild(firstItem)
        sectionEntries[1].classList.add('active-entry')
      }, timeout)

      if (this._showDots) {
        this.highlightDot(this.currentIndex, 'right')
      }
    } else {
      this.container.removeChild(lastItem)
      lastItem.style.marginLeft = leftMarginPercentage
      this.container.insertBefore(lastItem, firstItem)
      setTimeout(() => {
        lastItem.style.marginLeft = 0
        activeEntry.classList.remove('active-entry')
        lastItem.classList.add('active-entry')
      }, 10)

      if (this._showDots) {
        this.highlightDot(this.currentIndex, 'left')
      }
    }

    return this
  }
}

const addDotsToSlider = (object) => {
  const parent = object.container.parentElement
  const entries = object.entries
  const div = document.createElement('div')
  div.className = 'dots'
  let innerHtml = ''
  entries.forEach(() => {
    innerHtml += '<div class="dot"></div>'
  })
  div.innerHTML = innerHtml
  div.querySelector('.dot').classList.add('active')

  parent.append(div)
}

export default SimpleGallery
