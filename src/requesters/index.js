import webRequest from './brower.js'
import minigameRequest from './minigame.js'

export { webRequest, minigameRequest }

export let request = webRequest
export const setRequest = req => {
  request = req
}
