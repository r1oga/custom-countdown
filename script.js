const [
  inputContainer,
  countdownForm,
  dateEl,
  title,
  countdownEl,
  countdownElTitle,
  countdownBtn,
  complete,
  completeElInfo,
  completeBtn
] = [
  'input-container',
  'countdownForm',
  'date-picker',
  'title',
  'countdown',
  'countdown-title',
  'countdown-button',
  'complete',
  'complete-info',
  'complete-button'
].map(el => document.getElementById(el))
const timeElements = document.querySelectorAll('span')

let countdownTitle = ''
let countdownDate = ''
let countdownValue = Date()
let savedCountdown = {}

// min pickable date = today
dateEl.setAttribute('min', new Date().toISOString().split('T')[0])

// populate countdown
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const decomposeTime = milliseconds => {
  const days = Math.floor(milliseconds / DAY)
  const hours = Math.floor((milliseconds % DAY) / HOUR) - 2 // UTC + 2
  const minutes = Math.floor((milliseconds % HOUR) / MINUTE)
  const seconds = Math.floor((milliseconds % MINUTE) / SECOND)

  return [days, hours, minutes, seconds]
}

let id
const updateDOM = () => {
  const now = new Date().getTime()
  const delta = countdownValue - now // milliseconds

  const values = decomposeTime(delta)
  if (delta > 0) {
    timeElements.forEach((el, index) => {
      el.textContent = values[index]
    })
  } else {
    clearInterval(id)
    countdownEl.hidden = true
    complete.hidden = false
    completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`
  }
}

const updateCountdown = event => {
  event.preventDefault()
  countdownTitle = event.srcElement[0].value
  countdownDate = event.srcElement[1].value
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate
  }
  window.localStorage.setItem('countdown', JSON.stringify(savedCountdown))

  if (countdownDate === '') {
    alert('please select date')
  } else {
    inputContainer.hidden = true
    countdownForm.hidden = true
    countdownEl.hidden = false
    countdownValue = new Date(countdownDate).getTime()
    countdownElTitle.textContent = countdownTitle
    id = setInterval(updateDOM, 1000)
  }
}

countdownForm.addEventListener('submit', updateCountdown)

const reset = () => {
  clearInterval(id)
  inputContainer.hidden = false
  countdownForm.hidden = false
  countdownEl.hidden = true
  complete.hidden = true

  countdownTitle = ''
  countdownValue = ''
  document.getElementById('title').value = ''
  document.getElementById('date-picker').value = ''

  localStorage.removeItem('countdown')
}
countdownBtn.addEventListener('click', reset)
completeBtn.addEventListener('click', reset)

const restoreStoredCountdown = () => {
  const savedCountdown = JSON.parse(window.localStorage.getItem('countdown'))
  if (savedCountdown) {
    inputContainer.hidden = true
    countdownForm.hidden = true
    countdownEl.hidden = false
    countdownTitle = savedCountdown.title
    countdownElTitle.textContent = countdownTitle
    countdownValue = new Date(savedCountdown.date).getTime()
    id = setInterval(updateDOM, 1000)
  }
}
window.onload = restoreStoredCountdown
