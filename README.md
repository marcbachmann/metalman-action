# metalman-action

An action middleware for the metalman module.

```js
var metalman = require('metalman')
var action = require('metalman-action')
var command = metalman([action])

var func = command({
    action: function (cmd, callback) {
        console.log(cmd) // {foo: 'bar'}
        callback(null, cmd.foo)
    }
})

func({foo: 'bar'}, function (err, res) {
    // err == null
    // res == 'bar'
})
```
