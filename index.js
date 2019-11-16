module.exports = actionMiddlewareFactory

function actionMiddlewareFactory (config) {
  if (!config.action) return

  const action = config.action
  if (action.length >= 2) return executeCallbackAction
  else return executeAsyncAction

  function executeCallbackAction (cmd, callback) {
    let err, res
    try {
      let sameTick
      action.call(this, cmd, function next (_err, _res) {
        if (sameTick === false) {
          if (_err) return callback(_err)
          return callback(null, _res)
        } else {
          sameTick = true
          err = _err
          res = _res
        }
      })
      if (sameTick === undefined) {
        sameTick = false
        return
      }
    } catch (_err) {
      err = _err
    }

    if (err) return callback(err)
    return callback(null, res)
  }

  function executeAsyncAction (cmd, callback) {
    let res
    try {
      res = action.call(this, cmd)
    } catch (err) {
      return callback(err)
    }

    if (res && res.then) {
      res.then(
        (res) => setImmediate(callback, null, res),
        (err) => setImmediate(callback, err)
      )
    } else {
      return callback(null, res)
    }
  }
}
