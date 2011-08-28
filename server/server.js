var express = require('express'),
    http = require('http'),
    io = require('socket.io'),
    MemoryStore = express.session.MemoryStore,
    app = express.createServer(),
    sessionStore = new MemoryStore(),
    nko = require('nko')('wRA8t4RHBIt43pAw'),
    app = express.createServer(),
    sio = io.listen(app);

var jams = {};

sio.sockets.on('connection', function( socket ) {
    var userid;
    socket.on('broadcast', function( data ) {
      //console.log( 'socket.io broadcast ' + data );
      data.userid = userid;
      if(data.name === "Enter your name") {
        data.name = "Unknown User";
      }
      socket.broadcast.to( data.roomid ).emit( 'userupdate', data );
    });

    socket.on( 'join', function(data) {
        var roomid = data.roomid;

        var jam = jams[roomid] = jams[roomid] || {
          name: 'Unmamed Jam',
          userCount: 0
        };

        userid = jam.userCount;
        jam.userCount++;

        socket.join( roomid );
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
