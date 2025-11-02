import { MapManager } from "./MapManager.js"
import { PlacesManager } from "./PlacesManager.js"

export class EventManager {
  constructor(config, dom) {
    this.CONFIG = config
    this.DOM = dom
    this.placesManager = new PlacesManager(this.CONFIG, this.DOM)
    this.mapManager = new MapManager(this.CONFIG, this.placesManager)
  }

  init() {
    this.setupCockpitOpenBtn()
    this.setupMapOpenBtns()
    this.setupMapCloseBtn()
    this.setupMapClickOutside()
    this.setupEscapeKey()
  }

  setupCockpitOpenBtn() {
    this.DOM.home.buttons.openCockpit.addEventListener('click', () => {
      this.openCockpit()
    })
  }

  setupMapOpenBtns() {
    this.DOM.map.buttons.open.forEach(btn => {
      btn.addEventListener('click', () => {
        this.DOM.map.containers.subBox.style.display = 'flex'

        if (this.mapManager) {
          this.mapManager.destroy()
        }
        this.mapManager.initialize()
      })
    })
  }

  setupMapCloseBtn() {
    this.DOM.map.buttons.close.addEventListener('click', () => {
      this.closeMap()
    })
  }

  setupMapClickOutside() {
    this.DOM.map.containers.subBox.addEventListener('click', (e) => {
      if (e.target === this.DOM.map.containers.subBox) {
        this.closeMap()
      }
    })
  }

  setupEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMap()
      }
    })
  }

  openCockpit() {
    this.DOM.home.containers.homeSec.style.height = '0px'
  }

  closeMap() {
    this.DOM.map.containers.subBox.style.display = 'none'

    // if (this.mapManager) {
    //   this.mapManager.destroy()
    //   this.mapManager = null
    // }
  }
}