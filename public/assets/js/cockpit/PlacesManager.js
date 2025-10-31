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
    this.DOM.placesList.containers.cardsBox.innerHTML = ''
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
    placeDiv.classList.add('place-card')

    const googleSearchURL = `https://www.google.com/search?q=${encodeURIComponent(place.name + ' ' + place.city)}`
    const streetViewURL = place.latitude && place.longitude
      ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${place.latitude},${place.longitude}`
      : '#'

    placeDiv.innerHTML = `
      <img class="place-image" src="${imageURL}" alt="${place.name}" />
      <p class="place-name">${place.name}</p>
      <p class="place-city">${place.address}, ${place.city}</p> 
      <div class="place-type-box">
        <p>${place.label ?? place.type}</p>
      </div>
      <div class="place-links-box">
        <a class="streetview-link" href="${streetViewURL}" target="_blank"><span class="material-symbols-outlined">navigation</span> Street View</a>
        <a class="google-link" href="${googleSearchURL}" target="_blank"><span class="material-symbols-outlined">search</span> Google</a>
      </div>
    `
    this.DOM.placesList.containers.cardsBox.appendChild(placeDiv)
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