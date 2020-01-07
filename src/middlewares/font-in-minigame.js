import { RESOURCE_TYPE, RESOURCE_STATE } from '../resource.js'

const fontLoader = (ctx, next) => {
  const { res } = ctx
  if (res.type !== RESOURCE_TYPE.FONT) return next()

  const success = evt => {
    const { savedFilePath } = evt
    res.source = savedFilePath
    res.fontFamily = wx.loadFont(savedFilePath)
    next()
  }

  const fail = evt => {
    res.state = RESOURCE_STATE.ERROR
    res.emit('error', evt)
    res.reject()
    next()
  }

  wx.saveFile({
    tempFilePath: res.source,
    success,
    fail,
  })
}

export default fontLoader
