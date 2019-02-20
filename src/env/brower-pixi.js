import loader from '../index'
import request from '../middlewares/request-in-brower.js'
import jsonParser from '../middlewares/json-parser.js'
import { textureParser, spritesheetParser, spineParser } from '../middlewares/pixi.js'
import resolvePromise from '../middlewares/resolve-promise.js'

loader.use(request, jsonParser, textureParser, spritesheetParser, spineParser, resolvePromise)

