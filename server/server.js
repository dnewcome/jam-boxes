var express = require('express'),
    http = require('http'),
    io = require('socket.io'),
    MemoryStore = express.session.MemoryStore,
    app = express.createServer(),
    sessionStore = new MemoryStore(),
    nko = require('nko')('wRA8t4RHBIt43pAw'),
    app = express.createServer(),
    sio = io.listen(app);

var MAX_USERS_PER_ROOM = 4;

// the current jamid.
var currJamID = 1;

// a container of all the jams.
var jams = {};

// a lookup table of jams for each socket.
var socketToJams = {};

function getSocketId(socket) {
  return socket.id;
}

function getJamIdForSocket(socket) {
  var socketid = getSocketId(socket);
  var jamInfo = socketToJams[socketid];
  return jamInfo && jamInfo.jamid;
}

function getJamInfoForSocket(socket) {
  return socketToJams[socket.id];
};

function getAvailableJam() {
  var jamid, jam;

  // do a simple search through the jams for ones that are not yet full.
  for (jamid in jams) {
    jam = jams[jamid];

    if(jam.userCount < MAX_USERS_PER_ROOM) {
      // return immediately so that we know we found one and do not create a
      // new one.
      return jam;
    }
  }

 jam = createJam();

  return jam;
}


function getJam(jamid) {
  var jam = jams[jamid];
  return jam
}

function createJam() {
  // create a new jam
  var jamid = '_' + currJamID;
  currJamID++;

  jam = {
    id: jamid,
    name: 'Unmamed Jam',
    userCount: 0
  };

  jams[jamid] = jam;

  return jam;
};

function socketJoinJam(socket) {
  var jamid = getJamIdForSocket(socket),
      jam;

  if(jamid) {
    console.log("re-joining old jam");
    jam = getJam(jamid);
  }
  else {
    console.log("searching for available jam");
    // user is not part of a jam, add htem to one.
    var jam = getAvailableJam();

    var userid = jam.userCount;

    // associate the socket with a jam
    var socketid = getSocketId(socket);
    socketToJams[socketid] = {
      jamid: jam.id,
      userid: userid
    };

    jam.userCount++;
  }

  return jam;
}

function socketLeaveJam(socket) {
  var jamid = getJamIdForSocket(socket);

  if (jamid) {
    console.log("leaving jam: " + jamid);
    var jam = getJam(jamid);
    jam.userCount--;

    delete socketToJams[getSocketId(socket)];
  }
}

sio.sockets.on('connection', function(socket) {
  var userid;
  socket.on('broadcast', function(data) {
    console.log("broadcast received from: " + socket.id);
    var jamInfo = getJamInfoForSocket(socket);

    if(jamInfo) {
      data.userid = jamInfo.userid;
      if(data.name === "Enter your name") {
        data.name = "Unknown User";
      }

      console.log("broadcasting to: " + jamInfo.jamid);
      socket.broadcast.to(jamInfo.jamid).emit('userupdate', data);
    }
});

  socket.on('join', function(data) {
    var jam = socketJoinJam(socket);

    socket.join(jam.id);
  });

  socket.on('disconnect', function(data) {
    socketLeaveJam(socket);
  });
});

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static( __dirname + '/static' ));
  app.use(express.static( __dirname + './../client' ));
  app.set('views', __dirname + '/views');
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
