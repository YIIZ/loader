"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

_Object$defineProperty(exports, "webRequest", {
  enumerable: true,
  get: function get() {
    return _brower["default"];
  }
});

_Object$defineProperty(exports, "minigameRequest", {
  enumerable: true,
  get: function get() {
    return _minigame["default"];
  }
});

exports.setRequest = exports.request = void 0;

var _brower = _interopRequireDefault(require("./brower.js"));

var _minigame = _interopRequireDefault(require("./minigame.js"));

var request = _brower["default"];
exports.request = request;

var setRequest = function setRequest(req) {
  exports.request = request = req;
};

exports.setRequest = setRequest;