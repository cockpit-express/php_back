export class MapManager {
  constructor(config, placesManager) {
    this.CONFIG = config
    this.placesManager = placesManager
    this.map = null
    this.markers = null
  }

  initialize() {
    this.map = L.map('map').setView(this.CONFIG.MAP.CENTER, this.CONFIG.MAP.ZOOM_LEVEL)

    L.tileLayer(this.CONFIG.MAP.TILES_URL, {
      maxZoom: this.CONFIG.MAP.MAX_ZOOM,
      attribution: this.CONFIG.MAP.ATTRIBUTION,
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
      const res = await fetch(`${this.CONFIG.API.BASE_URL}/stations`)
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
        await this.placesManager.loadAndDisplayPlaces(stationData)
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