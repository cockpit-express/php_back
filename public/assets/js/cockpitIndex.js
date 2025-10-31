import { loadConfig } from "./config/loadConfig.js"
import { EventManager } from "./cockpit/EventsManager.js"

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
      contentSubBox: document.getElementById('windshield-content-sub-box'),
      contentBox: document.getElementById('windshield-content-box'),
    }
  },
  story: {
    containers: {
      storyBox: document.getElementById('story-box'),
    },
    elements: {
      txt: document.getElementById('story-text'),
      progressBar: document.getElementById('progress-bar')
    }
  },
  placesList: {
    containers: {
      box: document.getElementById('places-box'),
      cardsBox: document.getElementById('places-cards-box')
    },
    elements: {
      welcomeToStationX: document.getElementById('welcome-to-station-x'),
      xPlacesToDiscover: document.getElementById('x-places-to-discover')
    }
  }
}

async function initCockpit() {
  try {
    const CONFIG = await loadConfig()
    const eventManager = new EventManager(CONFIG, DOM)
    eventManager.init()

  } catch (err) {
    console.error(`Error during cockpit init`, err)
  }
}

document.addEventListener('DOMContentLoaded', initCockpit)