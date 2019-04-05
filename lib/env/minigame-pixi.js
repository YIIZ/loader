"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _index = _interopRequireDefault(require("../index"));

var _requestInMinigame = _interopRequireDefault(require("../middlewares/request-in-minigame.js"));

var _jsonParser = _interopRequireDefault(require("../middlewares/json-parser.js"));

var _fontInMinigame = _interopRequireDefault(require("../middlewares/font-in-minigame.js"));

var _pixi = require("../middlewares/pixi.js");

var _resolvePromise = _interopRequireDefault(require("../middlewares/resolve-promise.js"));

_index.default.use(_requestInMinigame.default, _fontInMinigame.default, _jsonParser.default, _pixi.textureParser, _pixi.spritesheetParser, _pixi.spineParser, _resolvePromise.default);