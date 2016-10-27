module.exports = actionMiddlewareFactory

function actionMiddlewareFactory (config) {
  if (!config.action) return

  var action = config.action
  return function executeActionMiddleware (cmd, callback) {
    try {
      action.call(this, cmd, next)
    } catch (err) {
      return callback(err)
    }

    function next (err, res) {
      setImmediate(callback, err, res)
    }
  }
}
