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

function createJam(jamid) {
  // create a new jam
  if(!jamid) {
    jamid = '_' + currJamID;
    currJamID++;
  }

  jam = {
    id: jamid,
    name: 'Unmamed Jam',
    userCount: 0
  };

  jams[jamid] = jam;

  return jam;
};

function socketJoinJam(socket, jam) {
  var userid = jam.userCount;

  // associate the socket with a jam
  var socketid = getSocketId(socket);
  socketToJams[socketid] = {
    jamid: jam.id,
    userid: userid
  };

  jam.userCount++;
}

function socketJoinSpecifiedJam(jamid, socket) {
  var jam = getJam(jamid);
  if(!jam) {
    // create new jam with that name.
    jam = createJam(jamid);
  }

  if(jam && jam.userCount < MAX_USERS_PER_ROOM) {
    socketJoinJam(socket, jam);
  }
  else {
    // no more users can be added to this jam
    jam = undefined;
  }

  return jam;
}

function socketJoinAvailableJam(socket) {
  var jamid = getJamIdForSocket(socket),
      jam;

  if(jamid) {
    jam = getJam(jamid);
  }
  else {

    // user is not part of a jam, add htem to one.
    var jam = getAvailableJam();
    socketJoinJam(socket, jam);
  }

  return jam;
}

function socketLeaveJam(socket) {
  var jamid = getJamIdForSocket(socket);

  if (jamid) {
    var jam = getJam(jamid);
    jam.userCount--;

    delete socketToJams[getSocketId(socket)];
  }
}

sio.sockets.on('connection', function(socket) {
  var userid;
  socket.on('broadcast', function(data) {
    var jamInfo = getJamInfoForSocket(socket);

    if(jamInfo) {
      data.userid = jamInfo.userid;
      if(data.name === "Enter your name") {
        data.name = "Unknown User";
      }

      socket.broadcast.to(jamInfo.jamid).emit('userupdate', data);
    }
});

  socket.on('join', function(data) {
    var jamid = data.jamid;
    var jam;

    if(jamid) {
      jam = socketJoinSpecifiedJam(jamid, socket);
    }

    if(!jam) {
      // Either no jam was specified or the jam was full
      jam = socketJoinAvailableJam(socket);
    }

    var jamInfo = getJamInfoForSocket(socket);
    socket.emit("joinack", jamInfo);
    socket.join(jamInfo.jamid);
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
    res.redirect( '/app.html' );
});

// app.listen( 3000 );
app.listen(process.env.NODE_ENV === 'production' ? 80 : 8000, function() {
  console.log('Ready');

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0)
    require('fs').stat(__filename, function(err, stats) {
      if (err) return console.log(err)
      process.setuid(stats.uid);
    });
});
