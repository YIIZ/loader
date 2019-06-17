"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _index = _interopRequireDefault(require("../index"));

var _resolvePromise = _interopRequireDefault(require("../middlewares/resolve-promise.js"));

_index["default"].afterRequest(_resolvePromise["default"]);