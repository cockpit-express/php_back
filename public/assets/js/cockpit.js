const openMapBtns = document.querySelectorAll('.map-open')
const closeMapBtn = document.getElementById('close-map')
const mapSubBox = document.getElementById('map-sub-box')

const minimap = document.getElementById('minimap')

const placesBox = document.getElementById('places-box')
const placesSubBox = document.getElementById('places-sub-box')

const windshieldLandscape = document.getElementById('windshield-landscape')

const storySubBox = document.getElementById('story-sub-box')
const storyTxt = document.getElementById('story-text')
const progressBar = document.getElementById('progress-bar')


// Map : ouverture / fermeture (ESC, btn, en dehors) 

openMapBtns.forEach(e => {
  e.addEventListener('click', () => {
    mapSubBox.style.display = 'flex'

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

    markers.on('popupopen', async (e) => {
      const popupNode = e.popup.getElement()
      const stationBtn = popupNode.querySelector('#station-btn')

      stationBtn.addEventListener('click', async () => {
        stationData = e.popup._source.data

        const res = await fetch(`http://localhost/saews303d/public/api/places?lat=${stationData.latitude}&lon=${stationData.longitude}&radiusKm=${'5'}`)
        const places = await res.json()
        
        const placesWithoutMedia = []

        mapSubBox.style.display = 'none'
        storySubBox.style.display = 'flex'

        // Wikimedia Promise

        const wikiMediaPromise = Promise.all(places.map(async p => {
          const res = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${p.name}-${p.city} filetype:bitmap&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&origin=*`)
          const wikiMediaRes = await res.json()

          if (wikiMediaRes.query) {
            const imgURL = Object.values(wikiMediaRes.query.pages)[0].imageinfo[0].url
            const placeDiv = document.createElement('div')

            placeDiv.classList.add('place-item')
            placeDiv.innerHTML = `
              <div>
                <p class="place-name">${p.name}</p>
                <p class="place-type">${p.type}</p>
                <p class="place-city">${p.city}</p>
                <img class="place-image" src="${imgURL}" />
              </div>
            `
            placesBox.appendChild(placeDiv)
            
          } else {
            placesWithoutMedia.push(p)
          }
        }))

        // Story Promise

        const storyPromise = displayStoryTransitionText()

        // Lancement Promises

        placesBox.innerHTML = ''
        await Promise.all([wikiMediaPromise, storyPromise])

        placesWithoutMedia.forEach(p => {
          const placeDiv = document.createElement('div')
          placeDiv.classList.add('place-item')

          placeDiv.innerHTML = `
            <div>
              <p class="place-name">${p.name}</p>
              <p class="place-type">${p.type}</p>
              <p class="place-city">${p.city}</p>
              <img class="place-image" src="#" />
            </div>
          `
          placesBox.appendChild(placeDiv)
        })

        placesSubBox.style.height = '100%'
        minimap.classList.add('minimap-wrapped')
        windshieldLandscape.style.display = 'none'
      })
    })
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

// Story transition

const steps = [
  { text: "Calcul de l'itinéraire...", progress: 15 },
  { text: "Propulsion du train...", progress: 30 },
  { text: "Un petit encas ?", progress: 60 },
  { text: "Arrivée imminente !", progress: 100 }
]
let textIndex = 0

function textAnimation(text, callback) {
  return new Promise(resolve => {
    let i = 0
    const interval = setInterval(() => {
      storyTxt.textContent = text.slice(0, i+1)
      i++

      if (i === text.length) {
        clearInterval(interval)
        setTimeout(resolve, 1000)
      }
    }, 20)
  })
}

async function displayStoryTransitionText() {
  for (const step of steps) {
    progressBar.style.width = `${step.progress}%`
    await textAnimation(step.text)
  }
  console.log("All's good")
}