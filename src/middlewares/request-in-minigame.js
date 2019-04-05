import { RESOURCE_TYPE, RESOURCE_STATE }  from '../resource.js'

// TODO 缓存本地？

const requestByImageElement = (ctx, next) => {
  const { res } = ctx
  const elem = new Image()

  const onError = () => {
    // TODO try again?
    res.state = RESOURCE_STATE.ERROR
    res.emit('error')
    next()
  }

  const onComplete = () => {
    res.state = RESOURCE_STATE.LOADED
    next()
  }

  elem.onload = onComplete
  elem.onerror = onError

  elem.src = res.url
  res.source = elem
}

const RESPONSE_TYPE = {
  DEFAULT: 'text',
  BUFFER: 'arraybuffer',
  TEXT: 'text',
}

const determineResponseType = (res) => {
  switch (res.type) {
    case RESOURCE_TYPE.TEXT:
    case RESOURCE_TYPE.JSON:
      return RESPONSE_TYPE.TEXT
    default:
      return RESPONSE_TYPE.BUFFER
  }
}

const requestByRequest = (ctx, next) => {
  const { res, loader } = ctx

  const { url } = res
  const responseType = determineResponseType(res)


  const onError = (evt) => {
    res.state = RESOURCE_STATE.ERROR
    res.emit('error', evt)
    res.reject()
  }

  const onLoad = (evt) => {
    if (evt.statusCode !== 200) return onError(evt)

    res.state = RESOURCE_STATE.LOADED
    res.source = evt.data
    next()
  }

  wx.request({
    url,
    dataType: responseType,
    responseType,
    success: onLoad,
    fail: onError,
  })
}

const requestByDownload = (ctx, next) => {
  const { res, loader } = ctx

  const { url } = res

  const onError = (evt) => {
    console.error('requestByDownload', evt)
    res.state = RESOURCE_STATE.ERROR
    res.emit('error', evt)
    res.reject()
  }

  const onLoad = (evt) => {
    if (evt.statusCode !== 200) return onError(evt)

    res.state = RESOURCE_STATE.LOADED
    res.source = evt.tempFilePath
    next()
  }

  wx.downloadFile({
    url,
    success: onLoad,
    fail: onError,
  })
}

const request = (ctx, next) => {
  const { res } = ctx
  switch (res.type) {
    case RESOURCE_TYPE.JSON:
    case RESOURCE_TYPE.TEXT:
      return requestByRequest(ctx, next)
    case RESOURCE_TYPE.IMAGE:
      return requestByImageElement(ctx, next)
    case RESOURCE_TYPE.FONT:
      return requestByDownload(ctx, next)
    default:
      return next()
  }
}

export default request
