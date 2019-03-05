"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var resolvePromise = function resolvePromise(ctx, next) {
  var loader = ctx.loader,
      res = ctx.res;
  res.resolve();
};

var _default = resolvePromise;
exports.default = _default;