const loader = require('../index')
const request = require('../middlewares/request-in-brower.js')
const jsonParser = require('../middlewares/json-parser.js')
const { textureParser, spritesheetParser, spineParser } = require('../middlewares/pixi.js')
const resolvePromise = require('../middlewares/resolve-promise.js')

loader.use(request, jsonParser, textureParser, spritesheetParser, spineParser, resolvePromise)
