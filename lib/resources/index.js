"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

_Object$defineProperty(exports, "MockResource", {
  enumerable: true,
  get: function get() {
    return _MockResource["default"];
  }
});

_Object$defineProperty(exports, "TextResource", {
  enumerable: true,
  get: function get() {
    return _Text["default"];
  }
});

_Object$defineProperty(exports, "JSONResource", {
  enumerable: true,
  get: function get() {
    return _JSON["default"];
  }
});

_Object$defineProperty(exports, "TextureResource", {
  enumerable: true,
  get: function get() {
    return _Texture["default"];
  }
});

_Object$defineProperty(exports, "SpritesheetResource", {
  enumerable: true,
  get: function get() {
    return _Spritesheet["default"];
  }
});

var _MockResource = _interopRequireDefault(require("./MockResource.js"));

var _Text = _interopRequireDefault(require("./Text.js"));

var _JSON = _interopRequireDefault(require("./JSON.js"));

var _Texture = _interopRequireDefault(require("./Texture.js"));

var _Spritesheet = _interopRequireDefault(require("./Spritesheet.js"));