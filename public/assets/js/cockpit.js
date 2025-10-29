const openMapBtns = document.querySelectorAll('.map-open')
const closeMapBtn = document.getElementById('close-map')
const mapBox = document.getElementById('map-box')
const mapSubBox = document.getElementById('map-sub-box')
const placesBox = document.getElementById('places-box')


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

// Functions


async function loadStations(map, markers) {
  try {
    const res = await fetch('http://localhost/saews303d/public/api/stations')
    const stations = await res.json()

    stations.forEach(s => {
      const marker = L.marker([s.latitude, s.longitude])
      marker.data = s

      marker.bindPopup(`
        <p>Gare de <b>${s.name}</b></p>
        <button id="station-btn">S'y rendre</button>
      `)
      markers.addLayer(marker)
    })
    map.addLayer(markers)

  } catch (error) {
    console.error('Error during stations fetch', error)
  }
}

// Map

const map = L.map('map').setView([46.603354, 1.888334], 6)

L.tileLayer('https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=3459ca86e7404c7082ff1460541f46d0', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  detectRetina: true
}).addTo(map)

const markers = L.markerClusterGroup({
  showCoverageOnHover: false,
})

loadStations(map, markers)

// Station popup

markers.on('popupopen', async (e) => {
  const popupNode = e.popup.getElement()
  const stationBtn = popupNode.querySelector('#station-btn')

  stationBtn.addEventListener('click', async () => {
    stationData = e.popup._source.data

    const res = await fetch(`http://localhost/saews303d/public/api/places?lat=${stationData.latitude}&lon=${stationData.longitude}&radiusKm=${'5'}`)
    const places = await res.json()

// Places list

    // require('./temp.json').forEach(p => {
    //   placesBox.innerHTML += `
    //     <div>
    //       <p>${p.name}</p>
    //       <p>${p.city}</p>
    //     </div>
    //   `
    // })
  })
})

// TEMP

fetch('./assets/js/temp.json').then(res => res.json()).then(places => {
  places.forEach(p => {
    const placeDiv = document.createElement('div')
    placeDiv.classList.add('place-item')

    placeDiv.innerHTML = `
      <div>
        <p class="place-name">${p.name}</p>
        <p class="place-type">${p.type}</p>
        <p class="place-city">${p.city}</p>
      </div>
    `
    placesBox.appendChild(placeDiv)
  })
})