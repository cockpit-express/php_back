export async function loadConfig() {
  try {
      const res = await fetch('./assets/config/config.json')
      return await res.json()
  } catch (err) {
    console.error(`Error during config load`)
    throw err
  }
}