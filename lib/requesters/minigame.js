"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _resource = require("../resource.js");

var _util = require("../util.js");

// TODO 缓存本地？
var requestByImageElement = function requestByImageElement(ctx) {
  var res = ctx.res;
  var elem = new Image();
  var deferred = new _util.Deferred();

  var onError = function onError() {
    // TODO try again?
    res.state = _resource.RESOURCE_STATE.ERROR;
    res.emit('error');
    deferred.resolve();
  };

  var onComplete = function onComplete() {
    res.state = _resource.RESOURCE_STATE.LOADED;
    deferred.resolve();
  };

  elem.onload = onComplete;
  elem.onerror = onError;
  elem.src = res.url;
  res.source = elem;
  return deferred.promise;
};

var requestByRequest = function requestByRequest(ctx) {
  var res = ctx.res,
      loader = ctx.loader;
  var deferred = new _util.Deferred();
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
    deferred.resolve();
  };

  wx.request({
    url: url,
    dataType: responseType,
    responseType: responseType,
    success: onLoad,
    fail: onError
  });
  return deferred.promise;
};

var requestByDownload = function requestByDownload(ctx) {
  var res = ctx.res,
      loader = ctx.loader;
  var deferred = new _util.Deferred();
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
    deferred.resolve();
  };

  wx.downloadFile({
    url: url,
    success: onLoad,
    fail: onError
  });
  return deferred.promise;
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

var request = function request(ctx) {
  var res = ctx.res;

  switch (res.type) {
    case _resource.RESOURCE_TYPE.JSON:
    case _resource.RESOURCE_TYPE.TEXT:
      return requestByRequest(ctx);

    case _resource.RESOURCE_TYPE.IMAGE:
      return requestByImageElement(ctx);

    case _resource.RESOURCE_TYPE.FONT:
      return requestByDownload(ctx);

    default:
      return;
  }
};

var _default = request;
exports["default"] = _default;