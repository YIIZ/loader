import { RESOURCE_TYPE, RESOURCE_STATE }  from '../resource.js'
import { Deferred } from '../util.js'

// TODO 缓存本地？

const requestByImageElement = (ctx) => {
  const { res } = ctx
  const elem = new Image()
  const deferred = new Deferred()

  const onError = () => {
    // TODO try again?
    res.state = RESOURCE_STATE.ERROR
    res.emit('error')
    deferred.resolve()
  }

  const onComplete = () => {
    res.state = RESOURCE_STATE.LOADED
    deferred.resolve()
  }

  elem.onload = onComplete
  elem.onerror = onError

  elem.src = res.url
  res.source = elem
  return deferred.promise
}

const requestByRequest = (ctx) => {
  const { res, loader } = ctx
  const deferred = new Deferred()

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
    deferred.resolve()
  }

  wx.request({
    url,
    dataType: responseType,
    responseType,
    success: onLoad,
    fail: onError,
  })

  return deferred.promise
}

const requestByDownload = (ctx) => {
  const { res, loader } = ctx
  const deferred = new Deferred()

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
    deferred.resolve()
  }

  wx.downloadFile({
    url,
    success: onLoad,
    fail: onError,
  })

  return deferred.promise
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

const request = (ctx) => {
  const { res } = ctx
  switch (res.type) {
    case RESOURCE_TYPE.JSON:
    case RESOURCE_TYPE.TEXT:
      return requestByRequest(ctx)
    case RESOURCE_TYPE.IMAGE:
      return requestByImageElement(ctx)
    case RESOURCE_TYPE.FONT:
      return requestByDownload(ctx)
    default:
      return
  }
}

export default request
