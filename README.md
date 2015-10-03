# Feedme

pub/sub using socket.io

## POST /auth

``` js
request.post('/auth', {
  json: {
    user: 'foo',
    password: 'bar'
  }
}, function (e,r,b) {
  socket.emit('join', b.token)
})
```

## publish event

``` js
var socket = require('socket.io-client')('https://localhost:4443')
socket.emit('publish', newEvent('beep', 'boop'))
socket.on('event', function (event) {
  // do stuff
})
```

## subscribe to events

``` js
var socket = require('socket.io-client')('https://localhost:4443')
socket.emit('join', 'palmetto')
socket.on('event', function (event) {
  // do stuff
})
```

``` sh
npm start
```

## Why

Built to support palmetto flow, see

[palmettoflow-ws](https://github.com/twilson63/palmettoflow-ws)

[palmettoflow-wslog](https://github.com/twilson63/palmettoflow-wslog)




