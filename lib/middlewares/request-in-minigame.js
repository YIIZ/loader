"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _resource = require("../resource.js");

// TODO 缓存本地？
var requestByImageElement = function requestByImageElement(ctx, next) {
  var res = ctx.res;
  var elem = new Image();

  var onError = function onError() {
    // TODO try again?
    res.state = _resource.RESOURCE_STATE.ERROR;
    res.emit('error');
    next();
  };

  var onComplete = function onComplete() {
    res.state = _resource.RESOURCE_STATE.LOADED;
    next();
  };

  elem.onload = onComplete;
  elem.onerror = onError;
  elem.src = res.url;
  res.source = elem;
};

var RESPONSE_TYPE = {
  DEFAULT: 'text',
  BUFFER: 'arraybuffer',
  TEXT: 'text'
};

var determineResponseType = function determineResponseType(res) {
  switch (res.type) {
    case _resource.RESOURCE_TYPE.TEXT:
    case _resource.RESOURCE_TYPE.JSON:
      return RESPONSE_TYPE.TEXT;

    default:
      return RESPONSE_TYPE.BUFFER;
  }
};

var requestByRequest = function requestByRequest(ctx, next) {
  var res = ctx.res,
      loader = ctx.loader;
  var url = res.url;
  var responseType = determineResponseType(res);

  var onError = function onError(evt) {
    res.state = _resource.RESOURCE_STATE.ERROR;
    res.emit('error', evt);
    res.reject();
  };

  var onLoad = function onLoad(evt) {
    if (evt.statusCode !== 200) return onError(evt);
    res.state = _resource.RESOURCE_STATE.LOADED;
    res.source = evt.data;
    next();
  };

  wx.request({
    url: url,
    dataType: responseType,
    responseType: responseType,
    success: onLoad,
    fail: onError
  });
};

var requestByDownload = function requestByDownload(ctx, next) {
  var res = ctx.res,
      loader = ctx.loader;
  var url = res.url;

  var onError = function onError(evt) {
    console.error('requestByDownload', evt);
    res.state = _resource.RESOURCE_STATE.ERROR;
    res.emit('error', evt);
    res.reject();
  };

  var onLoad = function onLoad(evt) {
    if (evt.statusCode !== 200) return onError(evt);
    res.state = _resource.RESOURCE_STATE.LOADED;
    res.source = evt.tempFilePath;
    next();
  };

  wx.downloadFile({
    url: url,
    success: onLoad,
    fail: onError
  });
};

var request = function request(ctx, next) {
  var res = ctx.res;

  switch (res.type) {
    case _resource.RESOURCE_TYPE.JSON:
    case _resource.RESOURCE_TYPE.TEXT:
      return requestByRequest(ctx, next);

    case _resource.RESOURCE_TYPE.IMAGE:
      return requestByImageElement(ctx, next);

    case _resource.RESOURCE_TYPE.FONT:
      return requestByDownload(ctx, next);

    default:
      return next();
  }
};

var _default = request;
exports.default = _default;