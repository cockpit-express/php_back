export class StoryManager {
  constructor(config, dom) {
    this.CONFIG = config
    this.DOM = dom
  }

  async displayTransition() {
    for (const step of this.CONFIG.STORY_TRANSITION.STEPS) {
      this.DOM.story.elements.progressBar.style.width = `${step.progress}%`
      await this.animateText(step.text)
    }
  }

  animateText(text) {
    return new Promise(resolve => {
      let charIndex = 0

      const interval = setInterval(() => {
        this.DOM.story.elements.txt.textContent = text.slice(0, charIndex + 1)
        charIndex++

        if (charIndex === text.length) {
          clearInterval(interval)
          setTimeout(resolve, this.CONFIG.STORY_TRANSITION.PAUSE_DURATION)
        }
      }, this.CONFIG.STORY_TRANSITION.TEXT_SPEED)
    })
  }
}