# Feedme

A very simple pub/sub http interface:

## POST /publish

## POST /auth

## subscribe to websocket

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


