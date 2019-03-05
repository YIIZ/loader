"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _resource = require("../resource.js");

var requestByImageElement = function requestByImageElement(ctx, next) {
  var res = ctx.res;
  var elem;

  if (typeof Image !== 'undefined') {
    elem = new Image();
  } else {
    elem = document.createElement(type);
  }

  if (res.crossOrigin) {
    elem.crossOrigin = res.crossOrigin;
  }

  var onError = function onError() {
    clearListener(); // TODO try again?

    res.emit('error');
    next();
  };

  var onComplete = function onComplete() {
    res.state = _resource.RESOURCE_STATE.LOADED;
    clearListener();
    next();
  };

  var onProgress = function onProgress() {
    res.emit('update');
  };

  var clearListener = function clearListener() {
    elem.removeEventListener('error', onError, false);
    elem.removeEventListener('load', onComplete, false);
    elem.removeEventListener('progress', onProgress, false);
  };

  elem.addEventListener('error', onError, false);
  elem.addEventListener('load', onComplete, false);
  elem.addEventListener('progress', onProgress, false);
  elem.src = res.url;
  res.source = elem;
};

var XHR_RESPONSE_TYPE = {
  DEFAULT: 'text',
  BUFFER: 'arraybuffer',
  BLOB: 'blob',
  DOCUMENT: 'document',
  JSON: 'json',
  TEXT: 'text'
};

var determineResponseType = function determineResponseType(res) {
  switch (res.type) {
    case _resource.RESOURCE_TYPE.TEXT:
    case _resource.RESOURCE_TYPE.JSON:
      return XHR_RESPONSE_TYPE.TEXT;

    default:
      return XHR_RESPONSE_TYPE.BLOB;
  }
};

var requestByXHR = function requestByXHR(ctx, next) {
  var res = ctx.res,
      loader = ctx.loader;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', res.url, true);
  xhr.timeout = loader.timeout;
  xhr.responseType = determineResponseType(res);

  var onError = function onError(evt) {
    res.emit('error', evt);
    clearListener();
    next();
  };

  var onTimeout = function onTimeout(evt) {
    res.emit('timeout', evt);
    clearListener();
    next();
  };

  var onAbort = function onAbort(evt) {
    res.emit('abort', evt);
    clearListener();
    next();
  };

  var onProgress = function onProgress(evt) {
    res.emit('update', evt);
  };

  var onLoad = function onLoad(evt) {
    res.state = _resource.RESOURCE_STATE.LOADED;
    res.source = xhr.response;
    clearListener();
    next();
  };

  var clearListener = function clearListener() {
    xhr.removeEventListener('error', onError, false);
    xhr.removeEventListener('timeout', onTimeout, false);
    xhr.removeEventListener('abort', onAbort, false);
    xhr.removeEventListener('progress', onProgress, false);
    xhr.removeEventListener('load', onLoad, false);
  };

  xhr.addEventListener('error', onError, false);
  xhr.addEventListener('timeout', onTimeout, false);
  xhr.addEventListener('abort', onAbort, false);
  xhr.addEventListener('progress', onProgress, false);
  xhr.addEventListener('load', onLoad, false);
  xhr.send();
};

var request = function request(ctx, next) {
  var res = ctx.res;

  switch (res.type) {
    case _resource.RESOURCE_TYPE.JSON:
    case _resource.RESOURCE_TYPE.TEXT:
      return requestByXHR(ctx, next);

    case _resource.RESOURCE_TYPE.IMAGE:
      return requestByImageElement(ctx, next);

    default:
      return next();
  }
};

var _default = request;
exports.default = _default;