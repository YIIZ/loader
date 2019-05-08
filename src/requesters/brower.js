import { RESOURCE_TYPE, RESOURCE_STATE }  from '../resource.js'
import { Deferred } from '../util.js'
import $url from 'url'

const requestByImageElement = (ctx) => {
  const { res } = ctx
  const deferred = new Deferred()
  let elem

  if (typeof Image !== 'undefined') {
    elem = new Image()
  } else {
    elem = document.createElement(type)
  }

  if (res.crossOrigin) {
    elem.crossOrigin = res.crossOrigin
  } else {
    elem.crossOrigin = determineCrossOrigin(res.url)
  }

  const onError = () => {
    clearListener()
    // TODO try again?
    res.emit('error')
    deferred.reject()
  }
  const onComplete = () => {
    res.state = RESOURCE_STATE.LOADED
    clearListener()
    deferred.resolve()
  }
  const onProgress = () => {
    res.emit('update')
    res.emit('progress')
  }
  const clearListener = () => {
    elem.removeEventListener('error', onError, false)
    elem.removeEventListener('load', onComplete, false)
    elem.removeEventListener('progress', onProgress, false)
  }

  elem.addEventListener('error', onError, false)
  elem.addEventListener('load', onComplete, false)
  elem.addEventListener('progress', onProgress, false)

  elem.src = res.url
  res.source = elem

  return deferred.promise
}

const requestByXHR = (ctx) => {
  const { res, timeout } = ctx
  const deferred = new Deferred()

  const xhr = new XMLHttpRequest()
  xhr.open('GET', res.url, true)

  xhr.timeout = timeout

  xhr.responseType = determineResponseType(res)

  const onError = (evt) => {
    res.emit('error', evt)
    clearListener()
    deferred.reject()
  }
  const onTimeout = (evt) => {
    res.emit('timeout', evt)
    clearListener()
    deferred.reject()
  }
  const onAbort = (evt) => {
    res.emit('abort', evt)
    clearListener()
    deferred.resolve()
  }
  const onProgress = (evt) => {
    res.emit('update', evt)
    res.emit('progress')
  }
  const onLoad = (evt) => {
    res.state = RESOURCE_STATE.LOADED
    res.source = xhr.response
    clearListener()
    deferred.resolve()
  }
  const clearListener = () => {
    xhr.removeEventListener('error', onError, false)
    xhr.removeEventListener('timeout', onTimeout, false)
    xhr.removeEventListener('abort', onAbort, false)
    xhr.removeEventListener('progress', onProgress, false)
    xhr.removeEventListener('load', onLoad, false)
  }

  xhr.addEventListener('error', onError, false)
  xhr.addEventListener('timeout', onTimeout, false)
  xhr.addEventListener('abort', onAbort, false)
  xhr.addEventListener('progress', onProgress, false)
  xhr.addEventListener('load', onLoad, false)

  xhr.send()
  return deferred.promise
}

const XHR_RESPONSE_TYPE = {
  DEFAULT: 'text',
  BUFFER: 'arraybuffer',
  BLOB: 'blob',
  DOCUMENT: 'document',
  JSON: 'json',
  TEXT: 'text',
}

const determineResponseType = (res) => {
  switch (res.type) {
    case RESOURCE_TYPE.TEXT:
    case RESOURCE_TYPE.JSON:
      return XHR_RESPONSE_TYPE.TEXT
    default:
      return XHR_RESPONSE_TYPE.BLOB
  }
}

const determineCrossOrigin = (url) => {
  // data: and javascript: urls are considered same-origin
  if (url.indexOf('data:') === 0) {
      return ''
  }

  // A sandboxed iframe without the 'allow-same-origin' attribute will have a special
  // origin designed not to match window.location.origin, and will always require
  // crossOrigin requests regardless of whether the location matches.
  if (window.origin !== window.location.origin) {
      return 'anonymous'
  }

  const u = $url.parse(url)
  if (u.host !== window.location.host) {
      return 'anonymous'
  }

  return ''
}

const request = (ctx) => {
  const { res } = ctx
  switch (res.type) {
    case RESOURCE_TYPE.JSON:
    case RESOURCE_TYPE.TEXT:
      return requestByXHR(ctx)
    case RESOURCE_TYPE.IMAGE:
      return requestByImageElement(ctx)
    default:
      return
  }
}

export default request
