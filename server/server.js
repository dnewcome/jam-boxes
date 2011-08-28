var express = require('express');
var http = require('http'),
    io = require('socket.io'),
    MemoryStore = express.session.MemoryStore,
    app = express.createServer(),
    sio = io.listen(app),
    sessionStore = new MemoryStore();

var jams = {};

sio.sockets.on('connection', function( client ) {
    client.on('broadcast', function( data ) {
      console.log( 'socket.io broadcast ' + data );
      client.broadcast.to( data.jam ).emit( 'broadcast', data );
    });

    client.on( 'join', function( data ) {
        client.join( data );
        jams.data = data;
        console.log( 'client joining  ' + data );
    });
});

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static( __dirname + '/static' ));
  app.use(express.static( __dirname + './../client' ));
  app.use(express.cookieParser());
  app.use(express.session({
    store: sessionStore,
    secret: 'secret',
    key: 'express.sid'
  }));
});

app.get('/', function(req, res){
    res.render( 'jams.jade', { jams:jams } );
});

app.listen( 3000 );
