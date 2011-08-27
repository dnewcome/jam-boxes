var express = require('express');
var http = require('http');
var io = require('socket.io');

var app = express.createServer()
  , io = io.listen(app);

var jams = {};

io.sockets.on('connection', function( client ) {
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

app.use(express.bodyParser());
app.use(express.static( __dirname + '/static' ));
app.use(express.static( __dirname + './../client' ));

app.get('/', function(req, res){
    res.render( 'jams.jade', { jams:jams } );
});

app.listen( 3000 );
