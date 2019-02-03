export const requestImageByElement = (ctx, next) => {
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
    elem.removeEventListener('error', onError, false)
    elem.removeEventListener('load', onComplete, false)
    elem.removeEventListener('progress', onProgress, false)
    // TODO try again?
    res.emit('error')
    next()
  }

  const onComplete = () => {
    elem.removeEventListener('error', onError, false)
    elem.removeEventListener('load', onComplete, false)
    elem.removeEventListener('progress', onProgress, false)
    res.loaded = true
    next()
  }

  const onProgress = () => {
    res.emit('update')
  }

  elem.addEventListener('error', onError, false)
  elem.addEventListener('load', onComplete, false)
  elem.addEventListener('progress', onProgress, false)

  elem.src = res.url
  res.data = elem
}

const XHR_RESPONSE_TYPE = {
  DEFAULT: 'text',
  BUFFER: 'arraybuffer',
  BLOB: 'blob',
  DOCUMENT: 'document',
  JSON: 'json',
  TEXT: 'text',
}

export const requestByXHR = (ctx, next) => {
  const { res, loader } = ctx

  const xhr = new XMLHttpRequest()
  xhr.open('GET', res.url, true)

  xhr.timeout = loader.timeout

  xhr.responseType = XHR_RESPONSE_TYPE.BUFFER

  const onError = (evt) => {
    res.emit('error', evt)
    next()
  }
  const onTimeout = (evt) => {
    res.emit('timeout', evt)
    next()
  }
  const onAbort = (evt) => {
    res.emit('abort', evt)
    next()
  }
  const onProgress = (evt) => {
    res.emit('update', evt)
  }
  const onLoad = (evt) => {
    res.loaded = true
    next()
  }

  xhr.addEventListener('error', onError, false)
  xhr.addEventListener('timeout', onTimeout, false)
  xhr.addEventListener('abort', onAbort, false)
  xhr.addEventListener('progress', onProgress, false)
  xhr.addEventListener('load', onLoad, false)

  xhr.send()
}

export const requestMock = (ctx, next) => {
  setTimeout(() => {
    ctx.res.data = {}
    next()
  }, 3000)
}

export const spriteSheet = async (ctx, next) => {
  const { res, loader } = ctx
  if (res.resourceType !== 'SPRITE_SHEET') return next()
  const jsonRes = await loader.load({ url: res.url, parent: res }).promise

}
