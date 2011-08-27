var express = require('express');
var http = require('http');
var io = require('socket.io');

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.static( __dirname + '/static' ));
app.use(express.static( __dirname + './../client' ));

app.listen( 3000 );
