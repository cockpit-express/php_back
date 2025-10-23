const openMapBtns = document.querySelectorAll('.map-open')
const closeMapBtn = document.getElementById('close-map')
const mapBox = document.getElementById('map-box')
const mapSubBox = document.getElementById('map-sub-box')


// Map : uuverture / fermeture (ESC, btn, en dehors) 

openMapBtns.forEach(e => {
  e.addEventListener('click', () => {
    mapSubBox.style.display = 'flex'
  })
})

closeMapBtn.addEventListener('click', () => {
  mapSubBox.style.display = 'none'
})

mapSubBox.addEventListener('click', (e) => {
  if (e.target === mapSubBox) {
    mapSubBox.style.display = 'none'
  }
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    mapSubBox.style.display = 'none'
  }
})