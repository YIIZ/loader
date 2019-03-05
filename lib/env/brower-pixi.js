"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _index = _interopRequireDefault(require("../index"));

var _requestInBrower = _interopRequireDefault(require("../middlewares/request-in-brower.js"));

var _jsonParser = _interopRequireDefault(require("../middlewares/json-parser.js"));

var _pixi = require("../middlewares/pixi.js");

var _resolvePromise = _interopRequireDefault(require("../middlewares/resolve-promise.js"));

_index.default.use(_requestInBrower.default, _jsonParser.default, _pixi.textureParser, _pixi.spritesheetParser, _pixi.spineParser, _resolvePromise.default);