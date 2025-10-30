import { StoryManager } from "./StoryManager.js"

export class PlacesManager {
  constructor(config, dom) {
    this.CONFIG = config
    this.DOM = dom
  }

  async loadAndDisplayPlaces(stationData) {
    try {
      const places = await this.fetchPlaces(stationData)
      this.prepareUI()

      const placesWithoutMedia = []
      const wikiMediaPromise = this.loadPlacesWithMedia(places, placesWithoutMedia)

      const storyManager = new StoryManager(this.CONFIG, this.DOM)
      const storyPromise = storyManager.displayTransition()

      await Promise.all([wikiMediaPromise, storyPromise])
      this.displayPlaces(placesWithoutMedia)
    
    } catch (err) {
      console.error(`Error during places load`, err)
    }
  }

  async fetchPlaces(stationData) {
    const url = `${this.CONFIG.API.BASE_URL}/places?lat=${stationData.latitude}&lon=${stationData.longitude}&radiusKm=${this.CONFIG.PLACES.RADIUS_KM}`
    const res = await fetch(url)
    return await res.json()
  }

  prepareUI() {
    this.DOM.map.containers.subBox.style.display = 'none'
    this.DOM.story.containers.storyBox.style.display = 'flex'
    this.DOM.windshield.containers.contentSubBox.style.display = 'flex'
    this.DOM.placesList.containers.box.innerHTML = ''
  }

  async loadPlacesWithMedia(places, placesWithoutMedia) {
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

  async fetchWikimediaImg(place) {
    const url = `${this.CONFIG.API.WIKIMEDIA_URL}?action=query&format=json&generator=search&gsrsearch=${place.name}-${place.city} filetype:bitmap&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&origin=*`
    const res = await fetch(url)
    const data = await res.json()

    if (data.query) {
      return Object.values(data.query.pages)[0].imageinfo[0].url
    }
    return null
  }

  appendPlaceElement(place, imageURL = '#') {
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
    this.DOM.placesList.containers.box.appendChild(placeDiv)
  }

  displayPlaces(placesWithoutMedia) {
    this.DOM.story.containers.storyBox.style.display = 'none'
    this.DOM.windshield.containers.contentSubBox.classList.add('windshield-content-sub-box-placesmod-init')
    void this.DOM.windshield.containers.contentSubBox.offsetWidth
    this.DOM.placesList.containers.box.style.display = 'flex'
    this.DOM.windshield.containers.contentSubBox.classList.add('windshield-content-sub-box-placesmod-extend')
    this.DOM.windshield.containers.contentBox.classList.add('windshield-content-box-placesmod-extend')

    placesWithoutMedia.forEach(place => {
      this.appendPlaceElement(place)
    })

    this.DOM.map.containers.minimap.classList.add('minimap-wrapped')
  }
}