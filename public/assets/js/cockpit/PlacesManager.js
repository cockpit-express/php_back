import { StoryManager } from "./StoryManager.js"
import { capitalizeFirstLetter } from "../utils/basics.js"

export class PlacesManager {
  constructor(config, dom) {
    this.CONFIG = config
    this.DOM = dom
  }

  async loadAndDisplayPlaces(stationData) {
    try {
      const places = await this.fetchPlaces(stationData)
      this.prepareUI(stationData, places)

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

  prepareUI(stationData, places) {
    this.DOM.placesList.containers.box.style.display = 'none'
    this.DOM.windshield.containers.contentSubBox.classList.remove('windshield-content-sub-box-placesmod-init')
    this.DOM.windshield.containers.contentSubBox.classList.remove('windshield-content-sub-box-placesmod-extend')
    this.DOM.windshield.containers.contentBox.classList.remove('windshield-content-box-placesmod-extend')

    this.DOM.map.containers.subBox.style.display = 'none'
    this.DOM.story.containers.storyBox.style.display = 'flex'
    
    this.DOM.placesList.elements.welcomeToStationX.innerHTML = `Bienvenue en gare de <span>${stationData.name} !</span>`
    this.DOM.placesList.elements.xPlacesToDiscover.innerHTML = `<span>${places.length}</span> lieux uniques à découvrir à moins de <span>${this.CONFIG.PLACES.RADIUS_KM}km</span> ✨`

    this.DOM.windshield.containers.contentSubBox.style.display = 'flex'
    this.DOM.placesList.containers.cardsBox.innerHTML = ''

// Partie graphique à retraivailler et à changer de place 

    const chartDiv = document.createElement('div')
    chartDiv.classList.add('place-card')
    chartDiv.classList.add('chart-card')
    this.DOM.placesList.containers.cardsBox.appendChild(chartDiv)

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('id', 'places-by-distance-to-station')
    svg.setAttribute('class', 'chart')
    chartDiv.appendChild(svg)

    chartDiv.insertAdjacentHTML('beforeend', 
      `
        <div class="chart-infos">
          <div class="chart-info-top">
            <p class="chart-name">Distance des lieux à la gare</p>
            <p class="chart-desc"><span class="material-symbols-outlined">info</span>La distance indiquée est calculée à vol d'oiseau. Par conséquent, l'itinéraire réel peut différer.<p>
          </div>
          <p class="chart-footer">La culture à portée de rails !</p>
        </div>
      `
    )

  const svgChart = d3.select('#places-by-distance-to-station')
  svgChart.selectAll('*').remove()

  // --- Dimensions & mise à l'échelle responsive via viewBox ---
  const WIDTH = 800, HEIGHT = 485
  const margin = { top: 20, right: 40, bottom: 40, left: 40 }
  const innerW = WIDTH - margin.left - margin.right
  const innerH = HEIGHT - margin.top - margin.bottom
  svgChart.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`).attr('preserveAspectRatio', 'xMidYMid meet')

  const g = svgChart.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  // --- Calcul km formule ---
  const toRad = d => (d * Math.PI) / 180
  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // --- Distances ---
  const distances = places
    .filter(p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
    .map(p => distanceKm(stationData.latitude, stationData.longitude, p.latitude, p.longitude))

  if (distances.length === 0) {
    g.append('text')
      .attr('x', innerW / 2)
      .attr('y', innerH / 2)
      .attr('text-anchor', 'middle')
      .text("Aucune donnée")
    return
  }

  // --- Groupement par kilomètres entiers ---
const maxD = d3.max(distances) || 0
const maxKm = Math.max(1, Math.ceil(maxD))

// Compte des lieux par km entier
const byKm = d3.rollup(
  distances,
  v => v.length,
  d => Math.floor(d)
)

const data = d3.range(0, maxKm + 1).map(k => ({
  x: k,                
  y: byKm.get(k) || 0, 
  x0: k,
  x1: k + 1
}))

// --- Échelles ---
const xScale = d3.scaleLinear()
  .domain([0, maxKm])  
  .range([0, innerW])

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.y) || 1])
  .nice()
  .range([innerH, 0])

// --- Grille Y 
g.append('g')
  .attr('class', 'grid')
  .call(d3.axisLeft(yScale).tickSize(-innerW).tickFormat(''))
  .selectAll('line').attr('stroke-opacity', 0.15)

// --- Axe X : 1 tick par km entier
const xAxis = d3.axisBottom(xScale)
  .tickValues(d3.range(0, maxKm + 1))
  .tickFormat(d => `${d} km`)

g.append('g')
  .attr('transform', `translate(0,${innerH})`)
  .call(xAxis)
  .selectAll('text')
  .style('font-size', '25px')
  .selectAll('path, line')
  .attr('stroke-width', 3)

// --- Axe Y 
const yAxis = d3.axisLeft(yScale).ticks(6)

g.append('g')
  .call(yAxis)
  .selectAll('text')
  .style('font-size', '25px')
  .selectAll('path, line')
  .attr('stroke-width', 4)

// --- Courbe segments droits
const line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .curve(d3.curveLinear)

g.append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', '#357cff')
  .attr('stroke-width', 4)
  .attr('d', line);

// --- Points 
g.selectAll('.pt')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'pt')
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y))
  .attr('r', 8)
  .attr('fill', '#357cff');

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
      <div class="place-top-box">
        <img class="place-image" src="${imageURL}" alt="${place.name}" />
        <div class="place-infos-box">
          <p class="place-name">${capitalizeFirstLetter(place.name)}</p>
          <p class="place-type">${place.label ? capitalizeFirstLetter(place.label) : capitalizeFirstLetter(place.type)}</p>
          <p class="place-address"><span class="material-symbols-outlined">account_balance</span>${place.address !== '' ? `${capitalizeFirstLetter(place.address)}, ` : ''}${capitalizeFirstLetter(place.city)}</p> 
        </div>
      </div>

      <div class="place-links-box">
        <a class="streetview-link" href="${streetViewURL}" target="_blank"><span class="material-symbols-outlined">near_me</span> Street View</a>
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
      this.appendPlaceElement(place, `./assets/images/illustrations/${this.CONFIG.PLACES.DEFAULT_IMAGE}`)
    })

    this.DOM.map.containers.minimap.classList.add('minimap-wrapped')
  }
}