var express = require('express');
var http = require('http');
var io = require('socket.io');

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.static( __dirname + '/static' ));
app.use(express.static( __dirname + './../client' ));

app.get('/', function(req, res){
    res.render( 'hello.jade' );
});

app.listen( 3000 );
