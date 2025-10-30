const DOM = {
  map: {
    buttons: {
      open: document.querySelectorAll('.map-open'),
      close: document.getElementById('close-map')
    },
    containers: {
      subBox: document.getElementById('map-sub-box'),
      minimap: document.getElementById('minimap'),
    }
  },
  windshield: {
    containers: {
      windshieldContentSubBox: document.getElementById('windshield-content-sub-box'),
      windshieldContentBox: document.getElementById('windshield-content-box'),
    }
  },
  story: {
    containers: {
      storyBox: document.getElementById('story-box'),
    },
    elements: {
      storyTxt: document.getElementById('story-text'),
      progressBar: document.getElementById('progress-bar')
    }
  },
  placesList: {
    containers: {
      placesBox: document.getElementById('places-box'),
    }
  }
}

class MapManager {
  constructor() {
    this.map = null
    this.markers = null
  }

  initialize() {
    this.map = L.map('map').setView([46.603354, 1.888334], 6)

    L.tileLayer('https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=3459ca86e7404c7082ff1460541f46d0', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      detectRetina: true
    }).addTo(this.map)

    this.markers = L.markerClusterGroup({
      showCoverageOnHover: false,
    })

    this.loadStations()
    this.setupMarkerEvents()
  }

  async loadStations() {
    try {
      const res = await fetch('http://localhost/saews303d/public/api/stations')
      const stations = await res.json()

      stations.forEach(station => {
        const marker = L.marker([station.latitude, station.longitude])
        marker.data = station

        marker.bindPopup(`
          <p>Gare de <b>${station.name}</b></p>
          <button id="station-btn">S'y rendre</button>
        `)
        this.markers.addLayer(marker)
      })

      this.map.addLayer(this.markers)

    } catch {
      console.error(`Error during stations load`)
    }
  }

  setupMarkerEvents() {
    this.markers.on('popupopen', async (e) => {
      const popupNode = e.popup.getElement()
      const stationBtn = popupNode.querySelector('#station-btn')

      stationBtn.addEventListener('click', async () => {
        const stationData = e.popup._source.data
        await PlacesManager.loadAndDisplayPlaces(stationData)
      })
    })
  }

  destroy() {
    if (this.map) {
      this.map.remove()
      this.map = null
      this.markers = null
    }
  }
}

class PlacesManager {
  static async loadAndDisplayPlaces(stationData) {
    try {
      const places = await this.fetchPlaces(stationData)
      this.prepareUI()

      const placesWithoutMedia = []
      const wikiMediaPromise = this.loadPlacesWithMedia(places, placesWithoutMedia)
      const storyPromise = StoryManager.displayTransition()

      await Promise.all([wikiMediaPromise, storyPromise])
      this.displayPlaces(placesWithoutMedia)
    
    } catch (err) {
      console.error(`Error during places load`, err)
    }
  }

  static async fetchPlaces(stationData) {
    const url = `http://localhost/saews303d/public/api/places?lat=${stationData.latitude}&lon=${stationData.longitude}&radiusKm=${'5'}`
    const res = await fetch(url)
    return await res.json()
  }

  static prepareUI() {
    DOM.map.containers.subBox.style.display = 'none'
    DOM.story.containers.storyBox.style.display = 'flex'
    DOM.windshield.containers.windshieldContentSubBox.style.display = 'flex'
    DOM.placesList.containers.placesBox.innerHTML = ''
  }

  static async loadPlacesWithMedia(places, placesWithoutMedia) {
    const promises = places.map(async (place) => {
      try {
        const imageURL = await this.fetchWikimediaImg(place)
        
        if (imageURL) {
          this.appendPlaceElement(place, imageURL)
        } else {
          placesWithoutMedia.push(place)
        }
      } catch (err) {
        placesWithoutMedia.push(place)
      }
    })
    await Promise.all(promises)
  }

  static async fetchWikimediaImg(place) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${place.name}-${place.city} filetype:bitmap&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&origin=*`
    const res = await fetch(url)
    const data = await res.json()

    if (data.query) {
      return Object.values(data.query.pages)[0].imageinfo[0].url
    }
    return null
  }

  static appendPlaceElement(place, imageURL = '#') {
    const placeDiv = document.createElement('div')
    placeDiv.classList.add('place-item')

    placeDiv.innerHTML = `
      <div>
        <p class="place-name">${place.name}</p>
        <p class="place-type">${place.type}</p>
        <p class="place-city">${place.city}</p>
        <img class="place-image" src="${imageURL}" alt="${place.name}" />
      </div>
    `
    DOM.placesList.containers.placesBox.appendChild(placeDiv)
  }

  static displayPlaces(placesWithoutMedia) {
    DOM.story.containers.storyBox.style.display = 'none'
    DOM.windshield.containers.windshieldContentSubBox.classList.add('windshield-content-sub-box-placesmod-init')
    void DOM.windshield.containers.windshieldContentSubBox.offsetWidth
    DOM.placesList.containers.placesBox.style.display = 'flex'
    DOM.windshield.containers.windshieldContentSubBox.classList.add('windshield-content-sub-box-placesmod-extend')
    DOM.windshield.containers.windshieldContentBox.classList.add('windshield-content-box-placesmod-extend')

    placesWithoutMedia.forEach(place => {
      this.appendPlaceElement(place)
    })

    DOM.map.containers.minimap.classList.add('minimap-wrapped')
  }
}

class StoryManager {
  static async displayTransition() {
    const steps = [
      { text: "Calcul de l'itinéraire...", progress: 15 },
      { text: "Propulsion du train...", progress: 30 },
      { text: "Un petit encas ?", progress: 60 },
      { text: "Arrivée imminente !", progress: 100 }
    ]

    for (const step of steps) {
      DOM.story.elements.progressBar.style.width = `${step.progress}%`
      await this.animateText(step.text)
    }
  }

  static animateText(text) {
    return new Promise(resolve => {
      let charIndex = 0

      const interval = setInterval(() => {
        DOM.story.elements.storyTxt.textContent = text.slice(0, charIndex + 1)
        charIndex++

        if (charIndex === text.length) {
          clearInterval(interval)
          setTimeout(resolve, 750)
        }
      }, 20)
    })
  }
}

class EventManager {
  static mapManager = null

  static init() {
    this.setupMapOpenBtns()
    this.setupMapCloseBtn()
    this.setupMapClickOutside()
    this.setupEscapeKey()
  }

  static setupMapOpenBtns() {
    DOM.map.buttons.open.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.map.containers.subBox.style.display = 'flex'

        if (this.mapManager) {
          this.mapManager.destroy()
        }

        this.mapManager = new MapManager()
        this.mapManager.initialize()
      })
    })
  }

  static setupMapCloseBtn() {
    DOM.map.buttons.close.addEventListener('click', () => {
      this.closeMap()
    })
  }

  static setupMapClickOutside() {
    DOM.map.containers.subBox.addEventListener('click', (e) => {
      if (e.target === DOM.map.containers.subBox) {
        this.closeMap()
      }
    })
  }

  static setupEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMap()
      }
    })
  }

  static closeMap() {
    DOM.map.containers.subBox.style.display = 'none'

    if (this.mapManager) {
      this.mapManager.destroy()
      this.mapManager = null
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  EventManager.init()
})