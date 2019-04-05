import loader from '../index'
import request from '../middlewares/request-in-minigame.js'
import jsonParser from '../middlewares/json-parser.js'
import fontLoader from '../middlewares/font-in-minigame.js'
import { textureParser, spritesheetParser, spineParser } from '../middlewares/pixi.js'
import resolvePromise from '../middlewares/resolve-promise.js'

loader.use(request, fontLoader, jsonParser, textureParser, spritesheetParser, spineParser, resolvePromise)

