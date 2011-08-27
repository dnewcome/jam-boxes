var express = require('express');
var http = require('http');
var io = require('socket.io');

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.static( __dirname + '/static' ));
uuid = require('node-uuid');

app.listen( 3000 );
