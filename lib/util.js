"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Deferred = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var Deferred = function Deferred() {
  var _this = this;

  (0, _classCallCheck2["default"])(this, Deferred);
  this.promise = new _promise["default"](function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
};

exports.Deferred = Deferred;