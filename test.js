var assert = require('assert')
var metalman = require('metalman')
var command = metalman([require('./index')])

// Catches sync errors
assert.doesNotThrow(function () {
  var error = new Error('Test')
  var fn = command({action: function (cmd, cb) {
    assert.equal(cmd, 'foo')
    throw error
  }})
  fn('foo', function (err) {
    assert.equal(err, error)
  })
})

// Answers with error objects returned in the callback
var error = new Error('Test')
var fn = command({action: function (cmd, cb) {
  assert.equal(cmd, null)
  cb(error)
}})

fn(null, function (err) {
  assert.equal(err, error)
})

// Passes string arguments to the command
var fn2 = command({action: function (cmd, cb) {
  assert.equal(cmd, 'some arg')
  cb()
}})

fn2('some arg', assert.ifError)

// Passes objects to the command
var orig = {foo: 'bar'}
var fn3 = command({action: function (cmd, cb) {
  assert.equal(cmd, orig)
  cb()
}})

fn3(orig, assert.ifError)

// Responds with objects passed in the callback
var something = {qux: 'quz'}
var fn4 = command({action: function (cmd, cb) {
  cb(null, something)
}})

fn4(null, function (err, obj) {
  assert.ifError(err)
  assert.equal(something, obj)
})

// Answers in the next tick
var isModified = false
var fn5 = command({action: function (cmd, cb) {
  cb()
  isModified = true
}})

fn5(null, function (err, obj) {
  assert.ifError(err)
  assert.equal(isModified, true)
})
