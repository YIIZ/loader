"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "webRequest", {
  enumerable: true,
  get: function get() {
    return _brower.default;
  }
});
Object.defineProperty(exports, "minigameRequest", {
  enumerable: true,
  get: function get() {
    return _minigame.default;
  }
});
exports.setRequest = exports.request = void 0;

var _brower = _interopRequireDefault(require("./brower.js"));

var _minigame = _interopRequireDefault(require("./minigame.js"));

var request = _brower.default;
exports.request = request;

var setRequest = function setRequest(req) {
  exports.request = request = req;
};

exports.setRequest = setRequest;