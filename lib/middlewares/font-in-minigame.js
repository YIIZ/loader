"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _resource = require("../resource.js");

var fontLoader = function fontLoader(ctx, next) {
  var res = ctx.res;
  if (res.type !== _resource.RESOURCE_TYPE.FONT) return next();

  var success = function success(evt) {
    var savedFilePath = evt.savedFilePath;
    res.source = savedFilePath;
    res.fontFamily = wx.loadFont(savedFilePath);
    next();
  };

  var fail = function fail(evt) {
    res.state = _resource.RESOURCE_STATE.ERROR;
    res.emit('error', evt);
    res.reject();
    next();
  };

  wx.saveFile({
    tempFilePath: res.source,
    success: success,
    fail: fail
  });
};

var _default = fontLoader;
exports.default = _default;