"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _index = _interopRequireDefault(require("../index"));

var _requesters = _interopRequireWildcard(require("../requesters"));

var _resolvePromise = _interopRequireDefault(require("../middlewares/resolve-promise.js"));

(0, _requesters.setRequest)(_requesters.minigameRequest);

_index["default"].afterRequest(_resolvePromise["default"]);