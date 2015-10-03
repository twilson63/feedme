var fetchConfig = require('zero-config')
var config = fetchConfig(__dirname, { dcValue: 'us-east-1'})
var uuid = require('uuid')
var http = require('http')
var jsonBody = require('body/json')
var sendJSON = require('send-data/json')
var io

var tokens = []

var server = http.createServer(function (req, res) {
  var url = req.url.split('?')[0]
  
  // when(req.method === 'POST' && url === '/publish')
  //   .run(handlePublish, [req, res])

  when(req.method === 'POST' && url === '/auth')
    .run(handleAuth, [req, res])
    .or(function () { res.end(JSON.stringify({ 
      name: 'FeedMe'}))
    })
})

io = require('socket.io')(server)
io.on('connection', function (socket) {
  socket.on('join', function (token) {
    if (~tokens.indexOf(token)) {
      socket.join('palmetto')
    }
  })
  socket.on('publish', function (event) {
    console.log('published')
    io.to('palmetto').emit('event', event)
  })
})

server.listen(process.env.PORT || 3000)

function when (test) {
  return {
    run: function (fn, args) {
      if (test) fn.apply(null, args)
      return {
        or: function (fn) {
          if (!test) fn()
        }
      }
    }
  }
}

function handlePublish (req, res) {
  // validate headers X-token
  when(~[tokens].indexOf(req.headers['X-token']))
    .run(function() {
      jsonBody(req, res, function (err, body) {
        io.to('palmetto').emit('event', body)
        sendJSON(req, res, { ok: true })
      })    
    })
}

function handleAuth (req, res) {
  jsonBody(req, res, function (err, body) {
    var auth = config.get('auth')
    
    when(body.user === auth.user && body.password === auth.password)
      .run(function () {
        var token = uuid.v4()
        tokens.push(token)
        sendJSON(req, res, { ok: true, token: token })  
      })
      
    when(body.user !== auth.user || body.password !== auth.password)      
      .run(function () {
        sendJSON(req, res, { ok: false })
      })
  })
}
