"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _resource = require("../resource.js");

var jsonParser = function jsonParser(ctx, next) {
  var res = ctx.res;
  if (res.type !== _resource.RESOURCE_TYPE.JSON) return next();
  res.data = JSON.parse(res.source);
  next();
};

var _default = jsonParser;
exports.default = _default;