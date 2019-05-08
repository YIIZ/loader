"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _resource = require("../resource.js");

var _util = require("../util.js");

var _url = _interopRequireDefault(require("url"));

var requestByImageElement = function requestByImageElement(ctx) {
  var res = ctx.res;
  var deferred = new _util.Deferred();
  var elem;

  if (typeof Image !== 'undefined') {
    elem = new Image();
  } else {
    elem = document.createElement(type);
  }

  if (res.crossOrigin) {
    elem.crossOrigin = res.crossOrigin;
  } else {
    elem.crossOrigin = determineCrossOrigin(res.url);
  }

  var onError = function onError() {
    clearListener(); // TODO try again?

    res.emit('error');
    deferred.reject();
  };

  var onComplete = function onComplete() {
    res.state = _resource.RESOURCE_STATE.LOADED;
    clearListener();
    deferred.resolve();
  };

  var onProgress = function onProgress() {
    res.emit('update');
    res.emit('progress');
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
  return deferred.promise;
};

var requestByXHR = function requestByXHR(ctx) {
  var res = ctx.res,
      timeout = ctx.timeout;
  var deferred = new _util.Deferred();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', res.url, true);
  xhr.timeout = timeout;
  xhr.responseType = determineResponseType(res);

  var onError = function onError(evt) {
    res.emit('error', evt);
    clearListener();
    deferred.reject();
  };

  var onTimeout = function onTimeout(evt) {
    res.emit('timeout', evt);
    clearListener();
    deferred.reject();
  };

  var onAbort = function onAbort(evt) {
    res.emit('abort', evt);
    clearListener();
    deferred.resolve();
  };

  var onProgress = function onProgress(evt) {
    res.emit('update', evt);
    res.emit('progress');
  };

  var onLoad = function onLoad(evt) {
    res.state = _resource.RESOURCE_STATE.LOADED;
    res.source = xhr.response;
    clearListener();
    deferred.resolve();
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
  return deferred.promise;
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

var determineCrossOrigin = function determineCrossOrigin(url) {
  // data: and javascript: urls are considered same-origin
  if (url.indexOf('data:') === 0) {
    return '';
  } // A sandboxed iframe without the 'allow-same-origin' attribute will have a special
  // origin designed not to match window.location.origin, and will always require
  // crossOrigin requests regardless of whether the location matches.


  if (window.origin !== window.location.origin) {
    return 'anonymous';
  }

  var u = _url.default.parse(url);

  if (u.host !== window.location.host) {
    return 'anonymous';
  }

  return '';
};

var request = function request(ctx) {
  var res = ctx.res;

  switch (res.type) {
    case _resource.RESOURCE_TYPE.JSON:
    case _resource.RESOURCE_TYPE.TEXT:
      return requestByXHR(ctx);

    case _resource.RESOURCE_TYPE.IMAGE:
      return requestByImageElement(ctx);

    default:
      return;
  }
};

var _default = request;
exports.default = _default;