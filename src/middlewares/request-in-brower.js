import { RESOURCE_TYPE, RESOURCE_STATE }  from '../resource.js'

const requestByImageElement = (ctx, next) => {
  const { res } = ctx
  let elem
  if (typeof Image !== 'undefined') {
    elem = new Image()
  } else {
    elem = document.createElement(type)
  }

  if (res.crossOrigin) {
    elem.crossOrigin = res.crossOrigin
  }

  const onError = () => {
    clearListener()
    // TODO try again?
    res.emit('error')
    next()
  }
  const onComplete = () => {
    res.state = RESOURCE_STATE.LOADED
    clearListener()
    next()
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

const requestByXHR = (ctx, next) => {
  const { res, loader } = ctx

  const xhr = new XMLHttpRequest()
  xhr.open('GET', res.url, true)

  xhr.timeout = loader.timeout

  xhr.responseType = determineResponseType(res)

  const onError = (evt) => {
    res.emit('error', evt)
    clearListener()
    next()
  }
  const onTimeout = (evt) => {
    res.emit('timeout', evt)
    clearListener()
    next()
  }
  const onAbort = (evt) => {
    res.emit('abort', evt)
    clearListener()
    next()
  }
  const onProgress = (evt) => {
    res.emit('update', evt)
    res.emit('progress')
  }
  const onLoad = (evt) => {
    res.state = RESOURCE_STATE.LOADED
    res.source = xhr.response
    clearListener()
    next()
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
}

const request = (ctx, next) => {
  const { res } = ctx
  switch (res.type) {
    case RESOURCE_TYPE.JSON:
    case RESOURCE_TYPE.TEXT:
      return requestByXHR(ctx, next)
    case RESOURCE_TYPE.IMAGE:
      return requestByImageElement(ctx, next)
    default:
      return next()
  }
}

export default request
