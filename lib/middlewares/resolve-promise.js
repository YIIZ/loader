"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var resolvePromise = function resolvePromise(ctx, next) {
  var loader = ctx.loader,
      res = ctx.res;
  res.resolve();
};

var _default = resolvePromise;
exports["default"] = _default;